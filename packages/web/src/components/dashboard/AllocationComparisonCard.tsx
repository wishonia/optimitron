"use client"

import { Card } from "@/components/ui/card"
import { AllocationBar } from "./AllocationBar"

interface AllocationCategory {
  label: string
  userLabel: string
  avgLabel: string
  govLabel: string
  colorClass: string
}

interface AllocationComparisonCardProps {
  userAllocation: number | null
  averageAllocation: number
  governmentAllocation?: number
  categoryA: AllocationCategory
  categoryB: AllocationCategory
  title?: string
}

export function AllocationComparisonCard({
  userAllocation,
  averageAllocation,
  governmentAllocation = 98,
  categoryA,
  categoryB,
  title = "WISHOCRATIC ALLOCATION",
}: AllocationComparisonCardProps) {
  if (userAllocation === null) {
    return null
  }

  const userB = 100 - userAllocation
  const avgB = 100 - averageAllocation
  const govB = 100 - governmentAllocation
  const difference = userB - avgB

  return (
    <Card className="bg-background border-4 border-primary p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-2xl font-black uppercase">
        <span className="text-brutal-pink">{title}</span>
      </h3>

      <div className="space-y-4">
        {/* Category B (complement) */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold uppercase">{categoryB.label}</span>
          </div>

          <AllocationBar
            percentage={userB}
            colorClass={categoryB.colorClass}
            label={categoryB.userLabel}
          />
          <AllocationBar
            percentage={avgB}
            colorClass={categoryB.colorClass}
            label={categoryB.avgLabel}
          />
          <AllocationBar
            percentage={govB}
            colorClass={categoryB.colorClass}
            label={categoryB.govLabel}
          />
        </div>

        {/* Category A */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold uppercase">{categoryA.label}</span>
          </div>

          <AllocationBar
            percentage={userAllocation}
            colorClass={categoryA.colorClass}
            label={categoryA.userLabel}
          />
          <AllocationBar
            percentage={averageAllocation}
            colorClass={categoryA.colorClass}
            label={categoryA.avgLabel}
          />
          <AllocationBar
            percentage={governmentAllocation}
            colorClass={categoryA.colorClass}
            label={categoryA.govLabel}
          />
        </div>
      </div>

      {/* Comparison Message */}
      <div className="border-primary">
        {difference > 0 ? (
          <div className="text-center p-4 bg-brutal-cyan border-2 border-primary">
            <p className="text-lg font-black">
              You allocated <span className="text-brutal-cyan text-2xl">{Math.abs(difference)}%</span> MORE
            </p>
            <p className="text-sm font-bold">to {categoryB.label.toLowerCase()} than the average person</p>
          </div>
        ) : difference < 0 ? (
          <div className="text-center p-4 bg-brutal-pink border-2 border-primary">
            <p className="text-lg font-black">
              You allocated <span className="text-brutal-pink text-2xl">{Math.abs(difference)}%</span> LESS
            </p>
            <p className="text-sm font-bold">to {categoryB.label.toLowerCase()} than the average person</p>
          </div>
        ) : (
          <div className="text-center p-4 bg-brutal-yellow border-2 border-primary">
            <p className="text-lg font-black">
              You matched the community average!
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
