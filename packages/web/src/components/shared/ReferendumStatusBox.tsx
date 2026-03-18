"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export function ReferendumStatusBox() {
  return (
    <div className="bg-brutal-yellow border-4 border-primary p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-12 h-12 text-brutal-pink" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-black uppercase mb-2">
            <span className="text-brutal-pink">STATUS:</span> REFERENDUM IN PROGRESS
          </h2>
          <p className="font-bold text-sm md:text-base leading-relaxed">
            The 1% Treaty referendum hasn&apos;t reached the tipping point yet.
            We need enough verified voters to demonstrate global demand for
            evidence-based governance. Help us get there.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <Link href={ROUTES.referendum}>
            <Button className="w-full md:w-auto bg-brutal-pink hover:bg-brutal-pink/90 text-brutal-pink-foreground border-4 border-primary font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-14 px-6 text-lg">
              VOTE NOW
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
