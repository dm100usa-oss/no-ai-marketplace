import { StubPage } from "@/components/StubPage";

export const metadata = { title: "Pricing" };

export default function Page() {
  return (
    <StubPage
      title="Pricing"
      intro="The first 100 profiles are free. After that, listing is paid. Compare plans below."
      note="The full pricing table and Stripe checkout are wired on stage 5."
    />
  );
}
