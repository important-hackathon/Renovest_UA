'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import Pagination from '../Pagination';
import { projects } from '@/data/projects';

const ITEMS_PER_PAGE = 6;

export default function ProjectsGrid() {
    const [currentPage, setCurrentPage] = useState(0);

    const pageCount = Math.ceil(projects.length / ITEMS_PER_PAGE);

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = projects.slice(offset, offset + ITEMS_PER_PAGE);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((project) => (
                    <ProjectCard
                        key={project.id}
                        image={project.image}
                        title={project.title}
                        description={project.description}
                        raised={project.raised}
                        percent={project.percent}
                    />
                ))}
            </div>

            <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
        </>
    );
}
