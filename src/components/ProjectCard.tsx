import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/database";
import { formatPrice } from "@/lib/format";
import Logo from "./Logo";
import { ArrowRightIcon } from "./icons";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project/${project.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="thumb-placeholder">
            <Logo className="h-10 w-10 opacity-50" />
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-ink shadow-sm backdrop-blur">
          {formatPrice(project.price_cents, project.currency)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-semibold leading-snug">{project.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink/60">{project.summary}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accentDark">
          View details
          <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
