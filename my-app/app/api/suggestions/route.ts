import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/suggestions?userId=xxx&date=YYYY-MM-DD
 * Returns menu items that best match the user's nutrition goals
 * Items with nutrition data are scored by how close they are to the user's
 * calorie and macro targets (per-meal estimate: daily / 3)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const dateStr = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
    const locationSlug = searchParams.get("locationSlug") ?? "fresh-food-company";

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const servedDate = new Date(dateStr + "T12:00:00Z");

    const goals = await prisma.userNutritionGoals.findUnique({
      where: { userId },
    });

    const items = await prisma.menuItem.findMany({
      where: {
        servedDate,
        locationSlug,
        calories: { not: null },
      },
      orderBy: { name: "asc" },
    });

    if (!goals) {
      return NextResponse.json({
        message: "User has no nutrition goals set",
        items: items.slice(0, 20),
      });
    }

    const targetCalories = Math.round(goals.goalCalories / 3);
    const targetProtein = Math.round(goals.goalProtein / 3);
    const targetCarbs = Math.round(goals.goalCarbs / 3);
    const targetFat = Math.round(goals.goalFat / 3);

    const suggestions = items
      .filter((i) => i.calories != null && i.protein != null && i.carbs != null && i.fat != null)
      .map((item) => {
        const c = item.calories!;
        const p = item.protein!;
        const carb = item.carbs!;
        const f = item.fat!;

        const calorieDiff = Math.abs(c - targetCalories);
        const proteinDiff = Math.abs(p - targetProtein);
        const carbsDiff = Math.abs(carb - targetCarbs);
        const fatDiff = Math.abs(f - targetFat);

        const score =
          calorieDiff * 0.5 + proteinDiff * 2 + carbsDiff * 0.5 + fatDiff * 1;
        return { ...item, score };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 15)
      .map(({ score: _score, ...item }) => item);

    return NextResponse.json({
      goals: {
        perMeal: {
          calories: targetCalories,
          protein: targetProtein,
          carbs: targetCarbs,
          fat: targetFat,
        },
        daily: {
          calories: goals.goalCalories,
          protein: goals.goalProtein,
          carbs: goals.goalCarbs,
          fat: goals.goalFat,
        },
      },
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
