import { NextResponse } from "next/server";
import { fetchMenuPage, parseMenuHtml } from "@/lib/hoyaeats";

/**
 * GET /api/menu/preview?date=YYYY-MM-DD
 * Fetches the Hoya Eats menu page, parses it, and returns the list of items found.
 * No DB writes, no recipe API calls—just a quick test to verify we can access the site.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr =
      searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const html = await fetchMenuPage(dateStr);
    const items = parseMenuHtml(html);

    return NextResponse.json({
      success: true,
      date: dateStr,
      source: "https://www.hoyaeats.com/locations/fresh-food-company/",
      count: items.length,
      items: items.slice(0, 50), // First 50 for readability
    });
  } catch (error) {
    console.error("Menu preview error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch menu from Hoya Eats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
