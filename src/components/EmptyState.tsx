import { BoxIcon } from "./icons";

export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accentDark">
        <BoxIcon className="h-7 w-7" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-ink/50">{description}</p>
    </div>
  );
}
