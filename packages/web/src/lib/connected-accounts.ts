import type { DashboardSocialAccount } from "@/types/dashboard";

const SOCIAL_PLATFORM_PROVIDER_IDS = {
  GITHUB: "github",
  TWITTER: "twitter",
  DISCORD: "discord",
  TELEGRAM: "telegram",
} as const;

interface ConnectedAccountPlatform {
  key: string;
  isWallet: boolean;
}

export function getVisibleConnectedAccountPlatforms<T extends ConnectedAccountPlatform>(
  platforms: T[],
  socialAccounts: DashboardSocialAccount[],
  availableAuthProviderIds: string[],
): T[] {
  const linkedPlatformSet = new Set(socialAccounts.map((account) => account.platform));
  const availableProviderIdSet = new Set(
    availableAuthProviderIds.map((providerId) => providerId.toLowerCase()),
  );

  return platforms.filter((platform) => {
    if (platform.isWallet || linkedPlatformSet.has(platform.key)) {
      return true;
    }

    const providerId =
      SOCIAL_PLATFORM_PROVIDER_IDS[
        platform.key as keyof typeof SOCIAL_PLATFORM_PROVIDER_IDS
      ];

    return providerId ? availableProviderIdSet.has(providerId) : false;
  });
}
