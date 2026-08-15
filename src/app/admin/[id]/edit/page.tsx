import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/ProjectForm";
import { updateProject } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit project</h1>
      <ProjectForm action={updateProject.bind(null, project.id)} project={project} submitLabel="Save changes" />
    </div>
  );
}
