"use client"

import { Card } from "@/components/retroui/Card"
import { CopyLinkButton } from "@/components/sharing/copy-link-button"
import { SocialShareButtons } from "@/components/sharing/social-share-buttons"
import { REFERRAL } from "@/lib/messaging"

interface ReferralLinkCardProps {
  referralLink: string
  className?: string
  id?: string
}

export function ReferralLinkCard({
  referralLink,
  className = "",
  id,
}: ReferralLinkCardProps) {
  return (
    <Card
      className={`bg-background border-4 border-primary p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}
      id={id}
    >
      <h3 className="text-2xl sm:text-3xl font-black uppercase text-center mb-3">
        Now Get All Your Friends to Play!
      </h3>
      <p className="font-bold text-base sm:text-lg text-center mb-4">
        {REFERRAL.earnOne}
      </p>

      <div className="mb-2 flex justify-center">
        <CopyLinkButton url={referralLink} variant="landing" />
      </div>

      <SocialShareButtons
        url={referralLink}
        text="Help optimize Earth. Every vote counts toward the tipping point."
      />
    </Card>
  )
}
