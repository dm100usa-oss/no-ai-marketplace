import { StubPage } from "@/components/StubPage";

export const metadata = { title: "Add your profile" };

export default function Page() {
  return (
    <StubPage
      title="Add your profile"
      intro="Join the directory of human-made creators. The first 100 profiles are free. Get found by buyers looking for work made by people."
      note="The Tally form and Stripe payment links are connected on stage 5."
    />
  );
}
