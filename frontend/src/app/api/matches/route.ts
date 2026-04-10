import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sportId = searchParams.get('sport_id');
  const status = searchParams.get('status');

  let query = supabase.from('retas').select('*, sports(*)').order('date', { ascending: true });

  if (sportId) query = query.eq('sport_id', sportId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('retas')
    .insert({
      ...body,
      organizer_id: user.id,
      current_players: 1,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Auto-join as organizer
  await supabase.from('reta_players').insert({
    reta_id: data.id,
    user_id: user.id,
    role: 'organizer',
    status: 'confirmed',
  });

  return NextResponse.json({ data }, { status: 201 });
}
