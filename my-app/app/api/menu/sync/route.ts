import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  fetchMenuWithNutrition,
} from "@/lib/hoyaeats";

/**
 * POST /api/menu/sync
 * Syncs Hoya Eats menu for a given date into the database
 * Body: { date?: string } - ISO date string, defaults to today
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const dateStr = body.date ?? new Date().toISOString().split("T")[0];

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const servedDate = new Date(dateStr + "T12:00:00Z");
    const items = await fetchMenuWithNutrition(dateStr, {
      maxRecipes: 100,
      delayMs: 150,
    });

    const synced: { id: string; name: string }[] = [];

    for (const item of items) {
      const created = await prisma.menuItem.upsert({
        where: {
          recipeId_servedDate_locationSlug: {
            recipeId: item.recipeId,
            servedDate,
            locationSlug: "fresh-food-company",
          },
        },
        create: {
          recipeId: item.recipeId,
          name: item.name,
          station: null,
          mealPeriod: null,
          locationSlug: "fresh-food-company",
          servedDate,
          dietaryTags: item.dietaryTags,
          calories: item.calories ?? undefined,
          protein: item.protein ?? undefined,
          carbs: item.carbs ?? undefined,
          fat: item.fat ?? undefined,
          servingSize: item.servingSize ?? undefined,
          ingredients: item.ingredients ?? undefined,
        },
        update: {
          name: item.name,
          dietaryTags: item.dietaryTags,
          calories: item.calories ?? undefined,
          protein: item.protein ?? undefined,
          carbs: item.carbs ?? undefined,
          fat: item.fat ?? undefined,
          servingSize: item.servingSize ?? undefined,
          ingredients: item.ingredients ?? undefined,
        },
      });
      synced.push({ id: created.id, name: created.name });
    }

    return NextResponse.json({
      success: true,
      date: dateStr,
      synced: synced.length,
      items: synced,
    });
  } catch (error) {
    console.error("Menu sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync menu" },
      { status: 500 }
    );
  }
}
