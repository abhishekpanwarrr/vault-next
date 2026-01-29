import Link from "next/link";

type Project = {
  id: string;
  name: string;
  secretsCount: number;
  updatedAt: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700">
      <Link href={`/protected/dashboard/projects/${project.id}`}>
        <h3 className="mb-1 font-medium">{project.name}</h3>
        <p className="text-sm text-neutral-400">
          {project.secretsCount} secrets • Updated {project.updatedAt}
        </p>
      </Link>
    </div>
  );
}
