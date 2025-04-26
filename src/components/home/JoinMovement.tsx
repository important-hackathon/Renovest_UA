import Image from "next/image";

const JoinMovement = () => {
  return (
    <div className="bg-[#000000]">
      <div className="max-w-7xl mx-auto px-5 box-border">
        <div className="py-15 md:py-30 flex justify-between items-center gap-10 flex-col  lg:flex-row">
          <div className="w-full sm:w-[60vw] lg:w-1/2">
            <img src="/assets/images/join-today.svg" alt="" />
          </div>

          <div className="text-white w-full sm:w-[60vw] lg:w-1/2 ">
            <div className="max-w-full lg:max-w-[400px] flex flex-col ml-auto">
              <h1 className="text-white font-bold text-[28px] lg:text-[32px] mb-3.5 lg:mb-5.5">
                Join the Movement Today
              </h1>

              <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-[8px] w-[120px] mb-8 lg:mb-12 " />

              <p className="text-base lg:text-[18px] mb-10 lg:mb-15">
                Invest in something truly meaningful — the recovery, growth, and
                future of Ukraine.{" "}
                <span className="font-bold">Renovest UA</span> — Your Investment
                in a New Chapter for Ukraine.
              </p>

              <div className="flex gap-5 items-center">
                <button className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-6.5 bg-[#0088FF] rounded-full">
                  Register
                </button>
                <button className="text-[18px] lg:text-2xl font-bold py-2.5 px-4 lg:px-6.5 bg-[#C6FF80] text-black rounded-full">
                  Explore Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default JoinMovement;
