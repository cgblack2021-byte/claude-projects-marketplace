import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import EmptyState from "@/components/EmptyState";
import { DownloadIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, project_id, amount_cents, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const projectIds = [...new Set((purchases ?? []).map((p) => p.project_id))];
  const { data: projects } = projectIds.length
    ? await supabase.from("projects").select("id, slug, name, deliverable_path").in("id", projectIds)
    : { data: [] };
  const projectById = new Map((projects ?? []).map((project) => [project.id, project]));

  return (
    <div>
      <h1 className="text-2xl font-bold">Your account</h1>
      <p className="mt-1 text-sm text-ink/60">{user.email}</p>

      <h2 className="mt-8 text-lg font-semibold">Purchased projects</h2>
      {!purchases || purchases.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="You haven't purchased anything yet"
            description="Browse the marketplace and buy a project to see it show up here."
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
          {purchases.map((purchase) => {
            const project = projectById.get(purchase.project_id);
            if (!project) return null;
            return (
              <li key={purchase.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <Link href={`/project/${project.slug}`} className="font-medium hover:text-accent">
                    {project.name}
                  </Link>
                  <p className="text-xs text-ink/50">
                    Purchased {new Date(purchase.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  {project.deliverable_path && (
                    <a
                      href={`/api/download/${project.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-accentDark hover:underline"
                    >
                      <DownloadIcon className="h-3.5 w-3.5" />
                      Download
                    </a>
                  )}
                  <p className="text-sm font-semibold">{formatPrice(purchase.amount_cents)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
