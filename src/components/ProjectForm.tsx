import type { Project } from "@/types/database";

export default function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  project?: Project;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required defaultValue={project?.name} className="input" />
        </div>
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">
            Slug (optional, auto-generated from name)
          </label>
          <input id="slug" name="slug" defaultValue={project?.slug} className="input" placeholder="my-project" />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium">
          Price (USD)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={project ? (project.price_cents / 100).toFixed(2) : undefined}
          className="input max-w-xs"
        />
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium">
          Short summary (shown on the project card)
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={project?.summary}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="marketing_plan_preview" className="mb-1 block text-sm font-medium">
          Marketing plan preview (visible to everyone, before purchase)
        </label>
        <textarea
          id="marketing_plan_preview"
          name="marketing_plan_preview"
          rows={5}
          defaultValue={project?.marketing_plan_preview}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="marketing_plan_full" className="mb-1 block text-sm font-medium">
          Full marketing plan (unlocked after purchase)
        </label>
        <textarea
          id="marketing_plan_full"
          name="marketing_plan_full"
          rows={8}
          defaultValue={project?.marketing_plan_full}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="thumbnail" className="mb-1 block text-sm font-medium">
          Thumbnail {project ? "(leave empty to keep current image)" : ""}
        </label>
        <input id="thumbnail" name="thumbnail" type="file" accept="image/*" className="input" />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={project ? project.is_published : true}
          className="h-4 w-4 rounded border-black/20"
        />
        Published (visible in the marketplace)
      </label>

      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
