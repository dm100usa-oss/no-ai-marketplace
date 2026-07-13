import type { ProfileStatus, VerificationStatus } from "@/lib/types";
import { CheckShield, StarIcon } from "./icons";
import type { Dictionary } from "@/i18n/types";

/** Verified badge — legally careful wording. Labels come from the dictionary. */
export function VerifiedBadge({
  status,
  dict,
}: {
  status: VerificationStatus;
  dict: Dictionary;
}) {
  if (status === "none") return null;
  const label =
    status === "verified-business"
      ? dict.badges.verifiedBusiness
      : dict.badges.verifiedCreator;
  return (
    <span className="badge badge-verified" title={dict.badges.verifiedTitle}>
      <CheckShield size={14} />
      {label}
    </span>
  );
}

/** Featured (leader) badge — set manually. */
export function FeaturedBadge({
  status,
  dict,
}: {
  status: ProfileStatus;
  dict: Dictionary;
}) {
  if (status !== "featured") return null;
  return (
    <span className="badge badge-featured">
      <StarIcon size={13} />
      {dict.badges.featured}
    </span>
  );
}
