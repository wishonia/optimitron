"use client"

import React, { useState } from "react"
import { Dialog } from "@/components/retroui/Dialog"
import { Badge } from "@/components/retroui/Badge"
import { ExternalLink, Info, FlaskConical, BookOpen, type LucideIcon } from "lucide-react"
import {
  fmtParam,
  fmtParamValueOnly,
  citations,
  type Parameter,
  type Citation,
  type SourceType,
} from "@optimitron/data/parameters"
import { Latex } from "@/components/ui/latex"
import { cn } from "@/lib/utils"

export interface ParameterValueProps {
  /** The parameter object to display */
  param: Parameter
  /** How to display the value (default "auto")
   *  - "auto": value only, no unit suffix (fmtParamValueOnly)
   *  - "integer": Math.round(value), no suffixes
   *  - "withUnit": full formatted value with unit (fmtParam)
   */
  display?: "auto" | "integer" | "withUnit"
  /** Significant figures (default 3) */
  figures?: number
  /** Show popover with metadata on hover (default: true) */
  showPopover?: boolean
  /** Additional CSS classes for the value */
  className?: string
}

export function ParameterValue({
  param,
  display = "auto",
  figures = 3,
  showPopover = true,
  className,
}: ParameterValueProps) {
  const [open, setOpen] = useState(false)

  const text = (() => {
    switch (display) {
      case "integer":
        return String(Math.round(param.value))
      case "withUnit":
        return fmtParam(param, figures)
      default:
        return fmtParamValueOnly(param, figures)
    }
  })()

  const hasMetadata = [
    param.displayName,
    param.description,
    param.formula,
    param.latex,
    param.sourceRef,
    param.sourceUrl,
    param.confidence,
    param.calculationsUrl,
    param.manualPageUrl,
    param.peerReviewed,
    param.conservative,
    param.confidenceInterval,
  ].some(Boolean)

  if (!showPopover || !hasMetadata) {
    return <span className={className}>{text}</span>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-help underline decoration-dotted underline-offset-2 decoration-foreground/30 inline text-left",
            className
          )}
        >
          {text}
        </button>
      </Dialog.Trigger>
      <Dialog.Content size="md">
        <Dialog.Header>
          {param.displayName ?? "Parameter Details"}
        </Dialog.Header>
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <ParameterDetailContent param={param} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}

const sourceTypeLabels: Record<SourceType, string> = {
  external: "From External Source",
  calculated: "Calculated From Other Values",
  definition: "Fixed Assumption",
}

function ParameterDetailContent({
  param,
}: {
  param: Parameter
}) {
  const citation: Citation | undefined = param.sourceRef
    ? citations[param.sourceRef]
    : undefined

  const fullValue = fmtParam(param)

  return (
    <div className="space-y-3">
      {/* Value + unit prominently displayed */}
      <div className="text-2xl font-black">{fullValue}</div>

      {param.description && (
        <p className="text-sm font-bold leading-relaxed text-muted-foreground">
          {param.description}
        </p>
      )}

      {/* Confidence interval — plain English */}
      {param.confidenceInterval && (
        <ConfidenceIntervalBlock param={param} />
      )}

      {param.latex ? (
        <div className="overflow-x-auto rounded-none border-2 border-primary bg-muted p-3">
          <Latex block>{param.latex}</Latex>
        </div>
      ) : param.formula ? (
        <div className="text-sm">
          <span className="font-bold">Formula: </span>
          <code className="bg-muted px-1.5 py-0.5 rounded-none border-2 border-primary text-xs">
            {param.formula}
          </code>
        </div>
      ) : null}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        {param.sourceType && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 font-bold uppercase border-primary"
          >
            {sourceTypeLabels[param.sourceType]}
          </Badge>
        )}
        {param.confidence && (
          <ConfidenceBadge confidence={param.confidence} />
        )}
        {param.peerReviewed && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 font-bold uppercase border-primary bg-brutal-cyan text-brutal-cyan-foreground"
          >
            peer-reviewed
          </Badge>
        )}
        {param.conservative && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 font-bold uppercase border-primary bg-brutal-green text-brutal-green-foreground"
          >
            conservative estimate
          </Badge>
        )}
      </div>

      {/* Links section */}
      <div className="space-y-3 pt-3 border-t-2 border-primary/20">
        <div className="flex flex-wrap items-center gap-2">
          {param.sourceUrl && (
            <MetaLink
              href={param.sourceUrl}
              icon={ExternalLink}
              accent="pink"
              label="Original Source"
            />
          )}
          {citation?.URL && citation.URL !== param.sourceUrl && (
            <MetaLink
              href={citation.URL}
              icon={ExternalLink}
              accent="pink"
              label="Published Study"
            />
          )}
          {!param.sourceUrl && !citation?.URL && param.sourceRef && (
            <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              Ref: {param.sourceRef.replace(/-/g, " ")}
            </span>
          )}
          {param.calculationsUrl && (
            <MetaLink
              href={param.calculationsUrl}
              icon={FlaskConical}
              accent="cyan"
              label="Simulations & Sensitivity"
            />
          )}
          {param.manualPageUrl && (
            <MetaLink
              href={param.manualPageUrl}
              icon={BookOpen}
              accent="yellow"
              label="Chapter"
              detail={param.manualPageTitle ?? "Manual"}
            />
          )}
        </div>

        {/* Citation detail */}
        {citation?.title && (
          <p className="text-xs font-bold text-muted-foreground leading-relaxed">
            {citation.title}
            {citation.author?.[0] && (
              <span>
                {" — "}
                {citation.author[0].literal ??
                  `${citation.author[0].family ?? ""}${citation.author[0].given ? `, ${citation.author[0].given}` : ""}`}
                {citation.author.length > 1 && " et al."}
              </span>
            )}
            {citation.issued?.["date-parts"]?.[0]?.[0] && (
              <span> ({citation.issued["date-parts"][0][0]})</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

function ConfidenceIntervalBlock({ param }: { param: Parameter }) {
  if (!param.confidenceInterval) return null

  const [low, high] = param.confidenceInterval
  const lowFmt = fmtParam({ ...param, value: low })
  const highFmt = fmtParam({ ...param, value: high })

  return (
    <div className="rounded-none border-2 border-primary/20 bg-muted p-3 text-sm">
      <div className="font-black uppercase text-xs tracking-wider mb-1">
        Estimated Range
      </div>
      <p className="font-bold text-muted-foreground">
        The true value likely falls between{" "}
        <span className="text-foreground">{lowFmt}</span>
        {" "}and{" "}
        <span className="text-foreground">{highFmt}</span>
        <span className="text-xs"> (95% confidence)</span>
      </p>
    </div>
  )
}

function MetaLink({
  href,
  icon: Icon,
  accent,
  label,
  detail,
}: {
  href: string
  icon: LucideIcon
  accent: "cyan" | "yellow" | "pink"
  label: string
  detail?: string
}) {
  const accentClasses = {
    cyan: "bg-brutal-cyan text-brutal-cyan-foreground",
    yellow: "bg-brutal-yellow text-brutal-yellow-foreground",
    pink: "bg-brutal-pink text-brutal-pink-foreground",
  }[accent]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-none border-2 border-primary px-2 py-1 text-[10px] leading-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none",
        accentClasses
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="font-black uppercase tracking-wide">{label}</span>
      {detail && (
        <span className="min-w-0 truncate font-semibold normal-case">
          {detail}
        </span>
      )}
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  )
}

const confidenceColorMap: Record<string, string> = {
  high: "bg-brutal-green text-brutal-green-foreground",
  medium: "bg-brutal-yellow text-brutal-yellow-foreground",
  low: "bg-brutal-red text-brutal-red-foreground",
  estimated: "bg-muted text-muted-foreground",
}

const confidenceLabelMap: Record<string, string> = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
  estimated: "Rough Estimate",
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] px-1.5 py-0 h-5 font-bold uppercase border-primary",
        confidenceColorMap[confidence] ?? "bg-muted"
      )}
    >
      {confidenceLabelMap[confidence] ?? confidence}
    </Badge>
  )
}
