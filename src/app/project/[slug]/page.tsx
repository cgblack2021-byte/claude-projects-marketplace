import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import BuyButton from "@/components/BuyButton";
import Logo from "@/components/Logo";
import { CheckCircleIcon, LockIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!project) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasPurchased = false;
  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("project_id", project.id)
      .maybeSingle();
    hasPurchased = !!purchase;
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
      <div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="thumb-placeholder">
              <Logo className="h-14 w-14 opacity-50" />
            </div>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-2 text-ink/60">{project.summary}</p>

        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            Marketing plan
            {!hasPurchased && <LockIcon className="h-4 w-4 text-ink/40" />}
          </h2>

          {hasPurchased ? (
            <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap leading-relaxed text-ink/80">
              {project.marketing_plan_full || project.marketing_plan_preview}
            </div>
          ) : (
            <div className="relative mt-4">
              <div className="whitespace-pre-wrap leading-relaxed text-ink/80">
                {project.marketing_plan_preview}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-black/15 bg-white p-4 text-sm text-ink/60">
                <LockIcon className="h-4 w-4 shrink-0 text-ink/40" />
                Purchase this project to unlock the full marketing plan.
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-3xl font-bold">{formatPrice(project.price_cents, project.currency)}</p>
        <p className="mt-1 text-sm text-ink/50">One-time purchase, lifetime access.</p>

        <div className="mt-6">
          {hasPurchased ? (
            <p className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              <CheckCircleIcon className="h-4 w-4" />
              You own this project
            </p>
          ) : (
            <>
              <BuyButton projectId={project.id} isLoggedIn={!!user} />
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/40">
                <LockIcon className="h-3.5 w-3.5" />
                Secure checkout powered by Stripe
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
