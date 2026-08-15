"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  return supabase;
}

async function uploadThumbnail(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  slug: string,
  file: File
) {
  const ext = file.name.split(".").pop() || "png";
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("thumbnails").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Thumbnail upload failed: ${error.message}`);
  const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
  return data.publicUrl;
}

function readProjectFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceDollars = Number(formData.get("price") ?? 0);

  return {
    name,
    slug: slugify(slugInput || name),
    price_cents: Math.round(priceDollars * 100),
    summary: String(formData.get("summary") ?? "").trim(),
    marketing_plan_preview: String(formData.get("marketing_plan_preview") ?? "").trim(),
    marketing_plan_full: String(formData.get("marketing_plan_full") ?? "").trim(),
    is_published: formData.get("is_published") === "on",
  };
}

export async function createProject(formData: FormData) {
  const supabase = await requireAdmin();
  const fields = readProjectFields(formData);

  const file = formData.get("thumbnail") as File | null;
  const thumbnail_url = file && file.size > 0 ? await uploadThumbnail(supabase, fields.slug, file) : null;

  const { error } = await supabase.from("projects").insert({ ...fields, thumbnail_url });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const fields = readProjectFields(formData);

  const file = formData.get("thumbnail") as File | null;
  const thumbnail_url = file && file.size > 0 ? await uploadThumbnail(supabase, fields.slug, file) : undefined;

  const update = thumbnail_url ? { ...fields, thumbnail_url } : fields;

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/project/${fields.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProject(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
