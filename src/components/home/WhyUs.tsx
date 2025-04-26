'use client';

import Image from 'next/image';

export default function WhyUs() {
    return (
        <section className="relative w-full bg-gradient-to-b from-white to-gray-100 py-20 overflow-hidden">
            <div className="absolute top-20 left-0 w-full h-full z-0">
                <Image
                    src="/assets/images/about-us-background.svg"
                    alt="Background"
                    width={700}
                    height={700}
                    className="w-full h-full"
                />
            </div>
                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-16">
                        Why Renovest UA?
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                        <div className="bg-[#76E472] rounded-2xl shadow-lg p-6 md:p-8 text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">
                                Complete Transparency
                            </h3>
                            <p className="text-black text-base leading-relaxed">
                                Track every project stage — from submission to completion — with detailed updates,
                                reports, and financial forecasts.
                            </p>
                        </div>

                        <div className="bg-[#0050E0] rounded-2xl shadow-lg p-6 md:p-8 text-left">
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                                Security and Trust
                            </h3>
                            <p className="text-base leading-relaxed">
                                Integrated with Ukraine’s "Diia" platform for secure user and project verification. All
                                data is protected.
                            </p>
                        </div>

                        <div className="bg-[#0050E0] rounded-2xl shadow-lg p-6 md:p-8 text-left">
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                                Direct Communication
                            </h3>
                            <p className="text-base leading-relaxed">
                                Investors can communicate directly with project managers and government representatives
                                through the platform.
                            </p>
                        </div>

                        <div className="bg-[#76E472] rounded-2xl shadow-lg p-6 md:p-8 text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">
                                Real-Time Analytics
                            </h3>
                            <p className="text-black text-base leading-relaxed">
                                Access dynamic reporting and real-time analytics on investment performance and project
                                progress.
                            </p>
                        </div>
                    </div>
                </div>
        </section>
);
}
