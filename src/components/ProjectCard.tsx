import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/database";
import { formatPrice } from "@/lib/format";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project/${project.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/40">
            No thumbnail
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug">{project.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink/60">{project.summary}</p>
        <p className="pt-1 text-sm font-semibold text-accentDark">
          {formatPrice(project.price_cents, project.currency)}
        </p>
      </div>
    </Link>
  );
}
