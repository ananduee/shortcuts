import { NextResponse } from "next/server";
import { db } from "@/db";
import { apps } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const { name, description, logo } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Application name is required" },
        { status: 400 }
      );
    }

    const app = await db
      .insert(apps)
      .values({
        name,
        description: description || null,
        logo: logo || null,
      })
      .returning();

    return NextResponse.json(app[0]);
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}