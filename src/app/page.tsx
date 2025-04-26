import AboutUs from "@/components/home/AboutUs";
import JoinMovement from "@/components/home/JoinMovement";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OurOfffers from "@/components/home/OurOffers";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AboutUs />
      <OurOfffers />
      <WhyChooseUs />
      <JoinMovement />
    </div>
  );
}
