import type { ProfileStatus, VerificationStatus } from "@/lib/types";
import { CheckShield, StarIcon } from "./icons";

/** Verified badge — legally careful wording (TZ 4.3). Links to rules on stage 4. */
export function VerifiedBadge({ status }: { status: VerificationStatus }) {
  if (status === "none") return null;
  const label =
    status === "verified-business" ? "Verified business" : "Verified creator";
  return (
    <span className="badge badge-verified" title="Verified based on submitted materials">
      <CheckShield size={14} />
      {label}
    </span>
  );
}

/** Featured (leader) badge — set manually (TZ 3.4). */
export function FeaturedBadge({ status }: { status: ProfileStatus }) {
  if (status !== "featured") return null;
  return (
    <span className="badge badge-featured">
      <StarIcon size={13} />
      Featured
    </span>
  );
}
