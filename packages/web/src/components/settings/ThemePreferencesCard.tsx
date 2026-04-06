"use client"

import { Moon, Sun } from "lucide-react"
import { Card } from "@/components/retroui/Card"
import { Button } from "@/components/retroui/Button"
import { useTheme } from "@/components/ThemeProvider"
import type { Theme } from "@/lib/theme"

const THEMES: Array<{
  value: Theme
  label: string
  description: string
  icon: typeof Sun
}> = [
  {
    value: "light",
    label: "Light",
    description: "Default app theme. Better match for the main site surfaces.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Optional retro mode for the people who still want the gloom.",
    icon: Moon,
  },
]

export function ThemePreferencesCard() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="border-4 border-primary mb-8">
      <Card.Header>
        <Card.Title className="text-2xl font-black uppercase">DISPLAY</Card.Title>
        <Card.Description className="font-bold">
          Light is the default. Dark mode lives here instead of in the navbar.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {THEMES.map((option) => {
            const Icon = option.icon
            const selected = option.value === theme

            return (
              <Button
                key={option.value}
                type="button"
                variant={selected ? "default" : "outline"}
                onClick={() => setTheme(option.value)}
                className="min-h-[88px] w-full justify-start gap-3 border-4 border-primary px-4 py-4 text-left"
              >
                <Icon className="h-5 w-5 shrink-0 stroke-[3px]" />
                <span className="flex flex-col">
                  <span className="text-sm font-black uppercase">{option.label}</span>
                  <span className="text-xs font-bold normal-case opacity-80">
                    {option.description}
                  </span>
                </span>
              </Button>
            )
          })}
        </div>

        <div className="border-2 border-dashed border-primary bg-muted p-4">
          <p className="text-sm font-bold">
            Theme preference is saved in this browser only. Demo and presentation views can still
            force dark mode when they need it.
          </p>
        </div>
      </Card.Content>
    </Card>
  )
}
