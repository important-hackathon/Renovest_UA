import Link from 'next/link';

export default function ToolCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition text-center flex items-center justify-center font-semibold text-lg bg-gray-50"
    >
      {title}
    </Link>
  );
}
