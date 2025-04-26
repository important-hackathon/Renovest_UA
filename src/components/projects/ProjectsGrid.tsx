'use client';

import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import Pagination from '../Pagination';
import supabase from '@/lib/supabaseClient';
import { ProjectWithOwner } from '@/types';

const ITEMS_PER_PAGE = 6;

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<ProjectWithOwner[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          investment_goal,
          investment_received,
          image_url,
          owner:owner_id (
            id,
            email,
            phone
          )
        `)
        .returns<ProjectWithOwner[]>(); // Tell TS what we expect

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const pageCount = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = projects.slice(offset, offset + ITEMS_PER_PAGE);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading projects...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((project) => {
          const percent = Math.min(
            Math.round((Number(project.investment_received) / Number(project.investment_goal)) * 100),
            100
          );

          return (
            <ProjectCard
              key={project.id}
              id={project.id}
              image={project.image_url ?? '/assets/images/default-project.svg'}
              title={project.title}
              description={project.description}
              raised={`$${project.investment_received} / $${project.investment_goal}`}
              percent={percent}
              ownerEmail={project.owner?.email ?? ''}
              ownerPhone={project.owner?.phone ?? ''}
            />
          );
        })}
      </div>

      {projects.length > ITEMS_PER_PAGE && (
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      )}
    </>
  );
}
