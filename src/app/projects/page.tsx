import ProjectsGrid from '@/components/projects/ProjectsGrid';

export default function ProjectsPage() {
  return (
    <section className="w-full min-h-screen py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Explore Opportunities
        </h2>
        <p className="max-w-2xl mx-auto mb-10">
          Welcome to the heart of Renovest UA — the Projects Hub.
          Here you can discover verified opportunities to make a real impact while building a strong investment
          portfolio.
        </p>
        <div className="bg-gradient-to-r from-[#0088FF] to-[#C6FF80] h-2 max-w-35 mb-14 mx-auto"/>

        {/* Project Grid */}
        <ProjectsGrid/>
      </div>
    </section>
  );
}
