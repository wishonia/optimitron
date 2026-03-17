import { getBaseUrl } from "@/lib/url";

export function getEmailUrls() {
  const base = getBaseUrl();
  return {
    dashboardLink: `${base}/dashboard`,
    unsubscribeLink: `${base}/api/email/unsubscribe`,
    prizeLink: `${base}/prize`,
    wishocracyLink: `${base}/wishocracy`,
    alignmentLink: `${base}/alignment`,
  };
}
