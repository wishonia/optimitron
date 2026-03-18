"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, MessageSquare } from "lucide-react"

interface OrganizationShareTemplatesCardProps {
  surveyLink: string
  organizationName: string
}

export function OrganizationShareTemplatesCard({ surveyLink, organizationName }: OrganizationShareTemplatesCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const templates = [
    {
      label: "Impact-Focused",
      text: `${organizationName} invites you to rank your budget priorities. Help us prove what citizens actually want so we can hold officials accountable with data: ${surveyLink}`,
    },
    {
      label: "Short & Compelling",
      text: `Take ${organizationName}'s 30-second priority survey. Help optimize governance with evidence instead of ideology: ${surveyLink}`,
    },
    {
      label: "Data-Driven",
      text: `${organizationName} is gathering citizen preferences to build an evidence-based optimal budget. Your rankings directly influence policy recommendations: ${surveyLink}`,
    },
    {
      label: "Mission-Oriented",
      text: `Help ${organizationName} demonstrate what citizens actually want from their government. Your voice matters in aligning policy with public priorities: ${surveyLink}`,
    },
    {
      label: "Personal Appeal",
      text: `${organizationName} needs your input! Quick 30-second survey ranking your budget priorities. Together we can make governance accountable to the people it serves: ${surveyLink}`,
    },
  ]

  const copyTemplate = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="border-2 border-primary mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Share Templates
        </CardTitle>
        <CardDescription className="font-bold">
          Copy-paste messages to share your organization&apos;s priority survey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template, index) => (
            <div
              key={index}
              className="border-2 border-primary p-4 bg-background hover:bg-brutal-yellow/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-black uppercase text-sm text-brutal-cyan">{template.label}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyTemplate(template.text, index)}
                  className="border-2 border-primary hover:bg-brutal-pink shrink-0"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-foreground/80">{template.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
