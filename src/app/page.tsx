import { createClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";

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
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects built on Claude
        </h1>
        <p className="mt-3 text-ink/60">
          Browse finished projects, preview the marketing plan for each one, and buy the ones
          you want to run with.
        </p>
        <div className="mt-6">
          <SearchBar defaultValue={q} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">Couldn&apos;t load projects: {error.message}</p>
      )}

      {projects && projects.length === 0 && (
        <p className="text-sm text-ink/50">
          {q ? `No projects match "${q}".` : "No projects published yet."}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
