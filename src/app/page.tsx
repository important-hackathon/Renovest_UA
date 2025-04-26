import AboutUs from "@/components/home/AboutUs";
import JoinMovement from "@/components/home/JoinMovement";
import WhyRenovate from "@/components/home/WhyChooseUs";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AboutUs />
      <JoinMovement />
      <WhyRenovate />
    </div>
  );
}
