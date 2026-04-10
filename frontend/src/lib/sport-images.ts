const SPORT_IMAGES: Record<string, string> = {
  // Fútbol / Soccer
  futbol:
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2000&auto=format&fit=crop',
  fútbol:
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2000&auto=format&fit=crop',
  soccer:
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2000&auto=format&fit=crop',
  'fútbol 7':
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2000&auto=format&fit=crop',
  'futbol 7':
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2000&auto=format&fit=crop',

  // Basketball
  basquetbol:
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop',
  basketball:
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop',
  basket:
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop',

  // Volleyball
  voleibol:
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop',
  volleyball:
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop',
  voley:
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop',

  // Tennis
  tenis:
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2000&auto=format&fit=crop',
  tennis:
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2000&auto=format&fit=crop',

  // Padel
  pádel:
    'https://images.unsplash.com/photo-1612534847738-b3af3b1fd699?q=80&w=2000&auto=format&fit=crop',
  padel:
    'https://images.unsplash.com/photo-1612534847738-b3af3b1fd699?q=80&w=2000&auto=format&fit=crop',

  // Baseball
  béisbol:
    'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop',
  beisbol:
    'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop',
  baseball:
    'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop',

  // Running
  running:
    'https://images.unsplash.com/photo-1461896836934-bd45ba8c7629?q=80&w=2000&auto=format&fit=crop',
  correr:
    'https://images.unsplash.com/photo-1461896836934-bd45ba8c7629?q=80&w=2000&auto=format&fit=crop',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop';

export function getSportImage(sportName: string | undefined | null): string {
  if (!sportName) return DEFAULT_IMAGE;
  return SPORT_IMAGES[sportName.toLowerCase()] ?? DEFAULT_IMAGE;
}
