import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    const { email, password } = await req.json();

    // sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message ?? "Invalid credentials" },
        { status: 401 }
      );
    }

    // you get session + access_token + refresh_token
    

    // Fetch user profile from your Supabase `users` table:
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json({ 
      session: data.session, 
      user: profile,
      message: "Login successful" 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
