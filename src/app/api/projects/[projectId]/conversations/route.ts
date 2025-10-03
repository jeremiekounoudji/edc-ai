import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { projectId } = await params;

  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { projectId } = await params;
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description } = body;

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert([{ 
      title, 
      description, 
      project_id: projectId,
      user_id: user.id 
    }])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
