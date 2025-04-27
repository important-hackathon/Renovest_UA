// src/components/projects/ProjectReportsButton.tsx
import Link from 'next/link';

interface ProjectReportsButtonProps {
  projectId: string;
  className?: string;
}

export default function ProjectReportsButton({ projectId, className = '' }: ProjectReportsButtonProps) {
  return (
    <Link
      href={`/projects/${projectId}/reports`}
      className={`bg-[#C6FF80] px-6 py-2 text-black rounded-full font-bold text-base md:text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out inline-flex items-center ${className}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-7a1 1 0 00-1 1v3a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      View reports
    </Link>
  );
}