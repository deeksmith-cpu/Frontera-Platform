import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";
import { trackEvent } from "@/lib/analytics/posthog-server";

// Create admin client at runtime (bypasses RLS)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase configuration for webhook");
  }

  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  // Verify webhook signature
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(payload, headers) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // Track webhook received
  await trackEvent("webhook_received", "system", {
    webhook_type: "clerk",
    event_type: event.type,
    svix_id: headers["svix-id"],
  });

  // Get Supabase admin client
  const supabaseAdmin = getSupabaseAdmin();

  // Handle organization.created event
  if (event.type === "organization.created") {
    const { id, name, slug } = event.data as {
      id: string;
      name: string;
      slug: string;
    };

    try {
      const { error } = await supabaseAdmin.from("clients").insert({
        clerk_org_id: id,
        company_name: name,
        slug: slug,
        tier: "pilot",
      });

      if (error) {
        console.error("Failed to create client:", error);
        return NextResponse.json(
          { error: "Failed to create client record" },
          { status: 500 }
        );
      }

      console.log(`Created client record for org: ${id}`);

      // Track org created
      await trackEvent("webhook_org_created", "system", {
        organization_id: id,
        organization_name: name,
        processing_duration_ms: Date.now() - startTime,
      });
    } catch (err) {
      console.error("Database error:", err);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }
  }

  // Handle organization.updated event
  if (event.type === "organization.updated") {
    const { id, name, slug } = event.data as {
      id: string;
      name: string;
      slug: string;
    };

    try {
      const { error } = await supabaseAdmin
        .from("clients")
        .update({
          company_name: name,
          slug: slug,
        })
        .eq("clerk_org_id", id);

      if (error) {
        console.error("Failed to update client:", error);
      }
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  // Handle organization.deleted event
  if (event.type === "organization.deleted") {
    const { id } = event.data as { id: string };

    try {
      const { error } = await supabaseAdmin
        .from("clients")
        .delete()
        .eq("clerk_org_id", id);

      if (error) {
        console.error("Failed to delete client:", error);
      }
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
