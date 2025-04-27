'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import InvestmentModal from '@/components/investments/InvestmentsModal';

interface ProjectCardProps {
    id: string;
    image?: string;
    title: string;
    description: string;
    raised: string;
    percent: number;
    ownerEmail?: string;
    ownerPhone?: string;
}

export default function ProjectCard({ id, image, title, description, raised, percent, ownerEmail, ownerPhone}: ProjectCardProps) {
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">
            {/* Project Image */}
            <div className="relative h-40 w-full overflow-hidden rounded-3xl">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Project Info */}
            <div className="flex flex-col flex-grow p-4 text-center">
                <h3 className="text-lg font-bold">{title}</h3>
                <div>
                    <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-0.5 my-2 max-w-14 mx-auto"/>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{width: `${percent}%`}}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{raised}</span>
                        <span>{percent}%</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col justify-center sm:flex-row gap-3 mt-auto">
                    <Link
                        href={`/projects/${id}`}
                        className="w-3/4 mx-auto bg-[#C6FF80] text-black font-semibold text-sm py-2 px-12 mb-2 mt-1 rounded-full hover:bg-[#B5E674] transition-colors text-center"
                    >
                        View Details
                    </Link>

                    {/*<button*/}
                    {/*    onClick={() => setIsInvestModalOpen(true)}*/}
                    {/*    className="w-full min-w-34 sm:w-auto bg-blue-600 text-white font-semibold text-sm py-2 px-6 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"*/}
                    {/*>*/}
                    {/*    Invest*/}
                    {/*</button>*/}
                </div>
            </div>

            {/* Investment Modal */}
            {/*<InvestmentModal*/}
            {/*    projectId={id}*/}
            {/*    projectTitle={title}*/}
            {/*    isOpen={isInvestModalOpen}*/}
            {/*    onClose={() => setIsInvestModalOpen(false)}*/}
            {/*/>*/}
        </div>
    );
}
