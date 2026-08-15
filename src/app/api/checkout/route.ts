import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to buy a project." }, { status: 401 });
  }

  const { projectId } = await request.json();
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ error: "Missing projectId." }, { status: 400 });
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, slug, name, price_cents, currency, thumbnail_url, is_published")
    .eq("id", projectId)
    .eq("is_published", true)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const { data: existingPurchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("project_id", project.id)
    .maybeSingle();

  if (existingPurchase) {
    return NextResponse.json({ error: "You already own this project." }, { status: 409 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: project.currency,
          unit_amount: project.price_cents,
          product_data: {
            name: project.name,
            images: project.thumbnail_url ? [project.thumbnail_url] : undefined,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      project_id: project.id,
      user_id: user.id,
    },
    success_url: `${siteUrl}/project/${project.slug}?purchased=1`,
    cancel_url: `${siteUrl}/project/${project.slug}`,
  });

  return NextResponse.json({ url: session.url });
}
