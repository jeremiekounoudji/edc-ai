import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  // Here you’d normally parse the Authorization header from the request
  // and use supabase.auth.getUser() to get the authenticated user

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ user, profile });
}
