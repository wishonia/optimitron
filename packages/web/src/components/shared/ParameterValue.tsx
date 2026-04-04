"use client"

import React, { useState, useRef, useCallback } from "react"
import { Popover } from "@/components/retroui/Popover"
import { Badge } from "@/components/retroui/Badge"
import { ExternalLink, Info, FlaskConical, BookOpen, type LucideIcon } from "lucide-react"
import {
  fmtParam,
  fmtParamValueOnly,
  formatConfidenceInterval,
  citations,
  type Parameter,
  type Citation,
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
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setOpen(true)
  }, [])

  const handleLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150)
  }, [])

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

  const confidenceInterval = formatConfidenceInterval(param)
  const hasMetadata = [
    param.displayName,
    param.description,
    param.formula,
    param.latex,
    param.sourceRef,
    param.confidence,
    param.calculationsUrl,
    param.manualPageUrl,
    param.peerReviewed,
    confidenceInterval,
  ].some(Boolean)

  if (!showPopover || !hasMetadata) {
    return <span className={className}>{text}</span>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <span onPointerEnter={handleEnter} onPointerLeave={handleLeave}>
        <Popover.Trigger asChild>
          <span
            className={cn(
              "cursor-help underline decoration-dotted underline-offset-2 decoration-foreground/30",
              className
            )}
          >
            {text}
          </span>
        </Popover.Trigger>
      </span>
      <Popover.Content
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        sideOffset={4}
        className="max-w-sm border-4 border-primary bg-background text-foreground p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <ParameterPopoverContent param={param} confidenceInterval={confidenceInterval} />
      </Popover.Content>
    </Popover>
  )
}

function ParameterPopoverContent({
  param,
  confidenceInterval,
}: {
  param: Parameter
  confidenceInterval: string | null
}) {
  const citation: Citation | undefined = param.sourceRef
    ? citations[param.sourceRef]
    : undefined

  return (
    <div className="space-y-2">
      {param.displayName && (
        <div className="font-black text-sm uppercase tracking-wider">
          {param.displayName}
        </div>
      )}

      {param.description && (
        <p className="text-xs font-bold leading-relaxed text-muted-foreground">
          {param.description}
        </p>
      )}

      {param.latex ? (
        <div className="overflow-x-auto">
          <Latex block>{param.latex}</Latex>
        </div>
      ) : param.formula ? (
        <div className="text-xs">
          <span className="font-bold">Formula: </span>
          <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
            {param.formula}
          </code>
        </div>
      ) : null}

      {confidenceInterval && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">95% CI:</span>
          <span className="font-mono">{confidenceInterval}</span>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-primary/20">
        <div className="flex items-center gap-1.5">
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {citation?.URL && (
            <a
              href={citation.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-brutal-pink hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              {citation.title ? "Source" : "Source"}
            </a>
          )}
          {!citation?.URL && param.sourceRef && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              {param.sourceRef}
            </span>
          )}
          {param.calculationsUrl && (
            <PopoverMetaLink
              href={param.calculationsUrl}
              icon={FlaskConical}
              accent="cyan"
              label="Calculations"
            />
          )}
          {param.manualPageUrl && (
            <PopoverMetaLink
              href={param.manualPageUrl}
              icon={BookOpen}
              accent="yellow"
              label="Chapter"
              detail={param.manualPageTitle ?? "Manual"}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PopoverMetaLink({
  href,
  icon: Icon,
  accent,
  label,
  detail,
}: {
  href: string
  icon: LucideIcon
  accent: "cyan" | "yellow"
  label: string
  detail?: string
}) {
  const accentClasses = accent === "cyan"
    ? "bg-brutal-cyan text-brutal-cyan-foreground"
    : "bg-brutal-yellow text-brutal-yellow-foreground"

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

function ConfidenceBadge({ confidence }: { confidence: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] px-1.5 py-0 h-5 font-bold uppercase border-primary",
        confidenceColorMap[confidence] ?? "bg-muted"
      )}
    >
      {confidence}
    </Badge>
  )
}
