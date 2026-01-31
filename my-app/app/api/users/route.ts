import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users - List all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { nutritionGoals: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (with optional nutrition goals)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, passwordHash, nutritionGoals } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash: passwordHash ?? null,
        ...(nutritionGoals && {
          nutritionGoals: {
            create: {
              goalCalories: nutritionGoals.goalCalories ?? 2000,
              goalProtein: nutritionGoals.goalProtein ?? 150,
              goalCarbs: nutritionGoals.goalCarbs ?? 250,
              goalFat: nutritionGoals.goalFat ?? 65,
            },
          },
        }),
      },
      include: { nutritionGoals: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
