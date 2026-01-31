import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/menu?date=YYYY-MM-DD&locationSlug=fresh-food-company
 * Returns menu items for a given date
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
    const locationSlug = searchParams.get("locationSlug") ?? "fresh-food-company";

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const servedDate = new Date(dateStr + "T12:00:00Z");

    const items = await prisma.menuItem.findMany({
      where: {
        servedDate,
        locationSlug,
      },
      orderBy: [{ station: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
