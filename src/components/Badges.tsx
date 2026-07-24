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
      <span
        aria-hidden
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: "1.6rem",
          height: "1.6rem",
          borderRadius: "9999px",
          background: "linear-gradient(180deg, #33a874 0%, #1f8a5b 100%)",
          color: "#fff",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
        }}
      >
        <CheckShield size={15} />
      </span>
      {label}
    </span>
  );
}

/** Featured (leader) badge — "First in category", set manually. The "1"
 *  sits in a filled gold circle like a medal, with "in category" beside it,
 *  on a soft gold plate: ① in category. */
export function FeaturedBadge({
  status,
  dict,
}: {
  status: ProfileStatus;
  dict: Dictionary;
}) {
  if (status !== "featured") return null;
  return (
    <span
      className="badge"
      style={{
        background: "linear-gradient(180deg, #fbf1d2 0%, #f6e4ad 100%)",
        color: "#8a6a17",
        border: "1px solid #e9d18f",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: "1.6rem",
          height: "1.6rem",
          borderRadius: "9999px",
          background: "linear-gradient(180deg, #e7b53c 0%, #c8901d 100%)",
          color: "#fff",
          fontSize: "0.95rem",
          fontWeight: 800,
          lineHeight: 1,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)",
        }}
      >
        1
      </span>
      {dict.badges.featured}
    </span>
  );
}
