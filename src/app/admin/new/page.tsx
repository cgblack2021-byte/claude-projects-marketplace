import ProjectForm from "@/components/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">New project</h1>
      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
