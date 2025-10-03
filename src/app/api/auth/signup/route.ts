import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(req: Request) {
  try {
    const { email, password, firstname, lastname, role, avatar } = await req.json();

    // 1. Sign up user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // auto confirm for now
    });

    if (signUpError || !signUpData.user) {
      return NextResponse.json({ error: signUpError?.message ?? 'Signup failed' }, { status: 400 });
    }
 

    // 2. Create profile row
    const userId = signUpData.user.id;
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        firstname,
        lastname,
        email,
        role: role || 'user',
        avatar
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }
  

    return NextResponse.json({ message: 'User created successfully', userId,user: signUpData.user }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
