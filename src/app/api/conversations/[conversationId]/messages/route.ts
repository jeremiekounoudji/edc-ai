import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(_: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { conversationId } = await params;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { conversationId } = await params;
  const body = await req.json();
  const { sender, content, file_url } = body;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender, content, file_url, conversation_id: conversationId }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
