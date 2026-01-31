import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
  retrieveExpertInsights,
  getAllExperts,
  getExpertsByTerritory,
  getExpertsByTopic,
} from "@/lib/knowledge/expert-index";

/**
 * GET /api/product-strategy-agent/expert-knowledge
 *
 * Returns expert insights filtered by territory, topic, or speaker.
 * Used by the Expert Sources panel in the Canvas.
 *
 * Query params:
 *   territory - "company" | "customer" | "competitor"
 *   topic - keyword to filter by topic
 *   speaker - filter by speaker name
 *   phase - "research" | "synthesis" | "planning"
 *   limit - max results (default 10)
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const territory = searchParams.get("territory") || undefined;
  const topic = searchParams.get("topic") || undefined;
  const speaker = searchParams.get("speaker") || undefined;
  const phase = searchParams.get("phase") || undefined;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const mode = searchParams.get("mode") || "insights"; // "insights" | "experts" | "by-territory" | "by-topic"

  try {
    switch (mode) {
      case "experts":
        return Response.json({ experts: getAllExperts() });

      case "by-territory":
        if (!territory) {
          return Response.json({ error: "territory param required" }, { status: 400 });
        }
        return Response.json({ experts: getExpertsByTerritory(territory) });

      case "by-topic":
        if (!topic) {
          return Response.json({ error: "topic param required" }, { status: 400 });
        }
        return Response.json({ experts: getExpertsByTopic(topic) });

      case "insights":
      default: {
        const insights = retrieveExpertInsights(
          territory,
          undefined,
          phase,
          limit
        );

        // Additional filtering by speaker if provided
        const filtered = speaker
          ? insights.filter((i) =>
              i.speaker.toLowerCase().includes(speaker.toLowerCase())
            )
          : insights;

        return Response.json({ insights: filtered });
      }
    }
  } catch (error) {
    console.error("Expert knowledge error:", error);
    return Response.json(
      { error: "Failed to retrieve expert knowledge" },
      { status: 500 }
    );
  }
}
