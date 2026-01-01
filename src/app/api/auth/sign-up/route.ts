import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 48);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, organizationName } =
      await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !organizationName) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    // 1. Create user in Clerk
    let user;
    try {
      user = await clerk.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName,
      });
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      const message = error.errors?.[0]?.message || "Failed to create user";
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      );
    }

    // 2. Create organization with user as admin
    let organization;
    try {
      organization = await clerk.organizations.createOrganization({
        name: organizationName,
        slug: generateSlug(organizationName),
        createdBy: user.id,
      });
    } catch (err: unknown) {
      // If org creation fails, we should clean up the user
      // But for now, we'll leave them - they can create an org later
      console.error("Failed to create organization:", err);
      const error = err as { errors?: Array<{ message: string }> };
      const message = error.errors?.[0]?.message || "Failed to create organization";
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      );
    }

    // User is automatically added as admin when they create the org

    return NextResponse.json({
      success: true,
      userId: user.id,
      organizationId: organization.id,
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
