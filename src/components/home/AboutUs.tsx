const AboutUs = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-end">
      <div className="w-full h-[80vh] bg-[url('/assets/images/about-us-background.svg')] bg-cover bg-center no-repeat">
        <div className="max-w-7xl mx-auto ">
          <div className="max-w-[600px]">
            <h1 className="text-[#000000] text-[48px] font-bold mb-3.5">
              Renovest UA
            </h1>
            <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] max-w-[150px] mb-6" />
            <p className="text-[18px]">
              Is an online platform that connects international investors with
              post-war reconstruction projects across Ukraine. We are building a
              transparent and secure ecosystem for investing in infrastructure
              recovery, startup support, real estate development, and innovative
              initiatives.
            </p>

            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
