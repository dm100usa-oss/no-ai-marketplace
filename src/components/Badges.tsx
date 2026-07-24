import type { ProfileStatus, VerificationStatus } from "@/lib/types";
import { CheckShield } from "./icons";
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

/** Featured (leader) badge — "First in category", set manually. The "1"
 *  sits in a filled circle so the rank reads at a glance, with the words
 *  "in category" beside it: ① in category. */
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
      <span
        aria-hidden
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: "1.05rem",
          height: "1.05rem",
          borderRadius: "9999px",
          background: "#a9691a",
          color: "#fff",
          fontSize: "0.7rem",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        1
      </span>
      {dict.badges.featured}
    </span>
  );
}
