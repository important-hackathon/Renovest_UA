import AboutUs from "@/components/home/AboutUs";
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AboutUs />
    </div>
  );
}