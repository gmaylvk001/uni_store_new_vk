import LuckyDrop from "@/components/luckydrop/LuckyDrop";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Join Our Lucky Drop | Unilet",
  description: "Join Unilet’s Lucky Drop and win exciting prizes.",
};

export default function JoinOurLuckyDropPage() {

    return (
    <>    <h1 className="sr-only">Join Our Lucky Drop</h1>    <LandingHeader />
      <LuckyDrop />
      <LandingFooter />
    </>
  );
}
