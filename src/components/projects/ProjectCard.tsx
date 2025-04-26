'use client';

import Image from 'next/image';
import Link from 'next/link';

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
    return (
        <div className="bg-white rounded-4xl shadow-md overflow-hidden flex flex-col">
            <div className="relative h-40 w-full overflow-hidden rounded-4xl">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow p-4 text-center">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{raised} raised</span>
                        <span>{percent}%</span>
                    </div>
                </div>

                {/* Owner contact */}
                {ownerEmail && (
                    <div className="text-xs text-gray-500 mb-2">
                        <p>Contact: {ownerEmail}</p>
                        {ownerPhone && <p>Phone: {ownerPhone}</p>}
                    </div>
                )}

                {/* View Details Button */}
                <Link
                    href={`/projects/${id}`}
                    className="mt-auto inline-block bg-[#C6FF80] text-black font-semibold text-sm py-2 px-6 rounded-full hover:bg-[#66d065] transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
