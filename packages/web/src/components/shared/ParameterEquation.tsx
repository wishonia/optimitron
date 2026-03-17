"use client"

import React from "react"
import type { Parameter } from "@/lib/parameters-calculations-citations"
import { cn } from "@/lib/utils"

export interface ParameterEquationProps {
  /** The parameter object containing latex or formula */
  param: Parameter
  /** Render as block equation (default) or inline */
  block?: boolean
  /** Additional CSS classes */
  className?: string
  /** Show fallback formula as code if no LaTeX available */
  showFallback?: boolean
}

/**
 * Renders a parameter's equation as code.
 * Uses formula field only (no LaTeX dependency).
 */
export function ParameterEquation({
  param,
  block = true,
  className = "",
  showFallback = true,
}: ParameterEquationProps) {
  if (showFallback && param.formula) {
    return (
      <code
        className={cn(
          "bg-muted px-2 py-1 rounded text-sm font-mono",
          block && "block my-2",
          className
        )}
      >
        {param.formula}
      </code>
    )
  }

  return null
}

export function ParameterEquationBlock({
  param,
  className = "",
  showFallback = true,
}: Omit<ParameterEquationProps, "block">) {
  return (
    <ParameterEquation
      param={param}
      block={true}
      className={className}
      showFallback={showFallback}
    />
  )
}

export function ParameterEquationInline({
  param,
  className = "",
  showFallback = true,
}: Omit<ParameterEquationProps, "block">) {
  return (
    <ParameterEquation
      param={param}
      block={false}
      className={className}
      showFallback={showFallback}
    />
  )
}
