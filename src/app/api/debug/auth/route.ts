import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    return NextResponse.json({
      user: user ? {
        id: user.id,
        email: user.email,
        authenticated: true
      } : null,
      error: error?.message,
      authenticated: !!user
    });
  } catch (err) {
    return NextResponse.json({
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}