import { NextResponse } from "next/server";

export async function middleware() {
  // No Supabase - this is a client-side only app
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
