import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_TTL_SECONDS = 60;

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", params.projectId)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "You don't own this project." }, { status: 403 });
  }

  // Fetch via the admin client (not the RLS-scoped one above): a purchase
  // already proves ownership, and the project could since have been
  // unpublished without affecting a buyer's right to their download.
  const admin = createAdminClient();
  const { data: project } = await admin
    .from("projects")
    .select("deliverable_path, slug")
    .eq("id", params.projectId)
    .single();

  if (!project?.deliverable_path) {
    return NextResponse.json({ error: "No downloadable files are available for this project yet." }, { status: 404 });
  }

  const { data: signed, error } = await admin.storage
    .from("deliverables")
    .createSignedUrl(project.deliverable_path, SIGNED_URL_TTL_SECONDS, {
      download: `${project.slug}.zip`,
    });

  if (error || !signed) {
    return NextResponse.json({ error: "Couldn't generate a download link. Try again." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
