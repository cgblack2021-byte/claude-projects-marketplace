import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe needs the raw request body to verify the signature.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const projectId = session.metadata?.project_id;
    const userId = session.metadata?.user_id;

    if (projectId && userId) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("purchases").upsert(
        {
          user_id: userId,
          project_id: projectId,
          stripe_session_id: session.id,
          amount_cents: session.amount_total ?? 0,
          status: "completed",
        },
        { onConflict: "user_id,project_id" }
      );

      if (error) {
        console.error("Failed to record purchase:", error);
        return NextResponse.json({ error: "Failed to record purchase." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
