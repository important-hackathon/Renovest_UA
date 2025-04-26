'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InvestmentModal from '@/components/investments/InvestmentsModal';

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

export default function ProjectCard({
    id,
    image,
    title,
    description,
    raised,
    percent,
    ownerEmail,
    ownerPhone
}: ProjectCardProps) {
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="relative h-40 w-full overflow-hidden">
                {image ? (
                    <div className="relative h-full w-full">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow p-5">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 mb-4 mt-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{raised}</span>
                        <span>{percent}%</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Link
                        href={`/projects/${id}`}
                        className="flex-1 text-center bg-blue-500 text-white font-medium text-sm py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    >
                        Details
                    </Link>
                    <button
                        onClick={() => setIsInvestModalOpen(true)}
                        className="flex-1 bg-green-500 text-white font-medium text-sm py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                        Invest
                    </button>
                </div>
            </div>

            {/* Investment Modal */}
            <InvestmentModal
                projectId={id}
                projectTitle={title}
                isOpen={isInvestModalOpen}
                onClose={() => setIsInvestModalOpen(false)}
            />
        </div>
    );
}