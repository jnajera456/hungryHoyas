import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/users/[id]/goals - Get a user's nutrition goals
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const goals = await prisma.userNutritionGoals.findUnique({
      where: { userId: id },
    });

    if (!goals) {
      return NextResponse.json(
        { error: "Nutrition goals not found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]/goals - Create or update nutrition goals
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { goalCalories, goalProtein, goalCarbs, goalFat } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goals = await prisma.userNutritionGoals.upsert({
      where: { userId: id },
      create: {
        userId: id,
        goalCalories: goalCalories ?? 2000,
        goalProtein: goalProtein ?? 150,
        goalCarbs: goalCarbs ?? 250,
        goalFat: goalFat ?? 65,
      },
      update: {
        ...(goalCalories !== undefined && { goalCalories }),
        ...(goalProtein !== undefined && { goalProtein }),
        ...(goalCarbs !== undefined && { goalCarbs }),
        ...(goalFat !== undefined && { goalFat }),
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals" },
      { status: 500 }
    );
  }
}
