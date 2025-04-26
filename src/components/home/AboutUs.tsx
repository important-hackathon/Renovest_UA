import Image from "next/image";
import Marquee from "react-fast-marquee";

const AboutUs = () => {
  return (
    <div className="min-h-[100vh] flex flex-col justify-end">
      <div className="w-full min-h-[80vh] bg-[url('/assets/images/about-us-background.svg')] bg-cover bg-center no-repeat relative">
        <div className="max-w-7xl mx-auto px-5 box-border">
          <div className="max-w-[600px]">
            <h1 className="text-[#000000] text-[32px] sm:text-[48px] font-bold mb-3.5">
              Renovest UA
            </h1>

            <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-5" />

            <p className="text-[16px] sm:text-[18px] mb-6">
              Is an online platform that connects international investors with
              post-war reconstruction projects across Ukraine. We are building a
              transparent and secure ecosystem for investing in infrastructure
              recovery, startup support, real estate development, and innovative
              initiatives.
            </p>

            <Marquee
              direction="right"
              speed={40}
              gradient={false}
              autoFill={true}
            >
              <p className="text-base md:text-xl font-bold text-black">
                облігації - стартапи - акції - краудфандинг -{" "}
              </p>
            </Marquee>

            <div className="flex gap-5 items-center mt-8">
              <button className="text-[18px] text-white lg:text-2xl font-bold py-2.5 px-4 lg:px-8 bg-[#0088FF] rounded-full">
                Register
              </button>
              <button className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-8 bg-[#C6FF80] text-black rounded-full">
                Explore Projects
              </button>
            </div>
          </div>
        </div>
        <img
          className="absolute right-30 top-0 h-full hidden lg:block"
          src="/assets/images/building.svg"
          alt="Building image"
        />
      </div>
    </div>
  );
};

export default AboutUs;
