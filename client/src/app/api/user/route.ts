import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  // ... other fields
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { user: null, message: "No token found" },
      { status: 401 }
    );
  }

  try {
    // Debugging:
    console.log("JWT Secret:", !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return NextResponse.json({ user: decoded });
    
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return NextResponse.json(
      { user: null, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}