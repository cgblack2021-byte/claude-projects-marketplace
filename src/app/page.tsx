import { createClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { SparkleIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,summary.ilike.%${q}%`);
  }

  const { data: projects, error } = await query;

  return (
    <div>
      <section className="-mx-4 mb-12 rounded-3xl bg-hero-mesh px-4 py-14 sm:-mx-6 sm:px-10 lg:-mx-8 lg:px-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-accentDark shadow-sm">
          <SparkleIcon className="h-3.5 w-3.5" />
          Built entirely with Claude
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Projects built on Claude, ready for you to run with
        </h1>
        <p className="mt-4 max-w-xl text-ink/60">
          Browse finished projects, preview the marketing plan for each one, and buy the ones
          that fit — one-time purchase, lifetime access.
        </p>
        <div className="mt-8 max-w-lg">
          <SearchBar defaultValue={q} />
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600">Couldn&apos;t load projects: {error.message}</p>
      )}

      {projects && projects.length === 0 && (
        <EmptyState
          title={q ? `No projects match "${q}"` : "No projects published yet"}
          description={
            q
              ? "Try a different search term, or browse everything below."
              : "Check back soon — new projects are added regularly."
          }
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
