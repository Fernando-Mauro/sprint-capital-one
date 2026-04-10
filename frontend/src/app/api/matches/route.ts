import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_STATUSES = ['open', 'full', 'in_progress', 'completed', 'cancelled'] as const;

const createRetaSchema = z.object({
  title: z.string().min(1).max(200),
  sport_id: z.string().regex(UUID_REGEX, 'Invalid sport_id UUID'),
  location_name: z.string().min(1).max(300),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:MM)'),
  end_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:MM)')
    .optional(),
  max_players: z.number().int().min(2).max(100),
  min_skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  description: z.string().max(2000).optional(),
  is_private: z.boolean().optional(),
});

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

  if (sportId && !UUID_REGEX.test(sportId)) {
    return NextResponse.json({ error: 'Invalid sport_id format' }, { status: 400 });
  }
  if (status && !(VALID_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

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

  const rawBody: unknown = await request.json();
  const parsed = createRetaSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('retas')
    .insert({
      ...parsed.data,
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
