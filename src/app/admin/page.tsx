import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/");

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage projects</h1>
        <Link href="/admin/new" className="btn-primary">
          New project
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-ink/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {projects?.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3 font-medium">{project.name}</td>
                <td className="px-4 py-3">{formatPrice(project.price_cents, project.currency)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      project.is_published
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold text-ink/50"
                    }
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/${project.id}/edit`} className="text-accent hover:underline">
                      Edit
                    </Link>
                    <form action={deleteProject.bind(null, project.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!projects || projects.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
