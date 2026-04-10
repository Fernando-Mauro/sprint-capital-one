const API_KEY = process.env.NEXT_PUBLIC_AWS_MAP_API_KEY ?? '';
const REGION = process.env.NEXT_PUBLIC_AWS_REGION ?? 'us-east-1';
const MAP_STYLE = process.env.NEXT_PUBLIC_AWS_MAP_STYLE ?? 'Standard';
const COLOR_SCHEME = process.env.NEXT_PUBLIC_AWS_MAP_COLOR_SCHEME ?? 'Dark';

export const MAP_STYLE_URL = `https://maps.geo.${REGION}.amazonaws.com/v2/styles/${MAP_STYLE}/descriptor?key=${API_KEY}&color-scheme=${COLOR_SCHEME}`;

export interface PlaceSuggestion {
  placeId: string;
  label: string;
  latitude: number;
  longitude: number;
}

const PLACES_BASE = `https://places.geo.${REGION}.amazonaws.com/v2`;

interface AwsPlaceResultItem {
  PlaceId?: string;
  Title?: string;
  Address?: { Label?: string };
  Position?: [number, number];
}

/**
 * Search for places by text using Amazon Location Places API v2 (POST + JSON body).
 * Uses the suggest endpoint for autocomplete.
 */
export async function searchPlaces(
  query: string,
  biasPosition?: [number, number],
): Promise<PlaceSuggestion[]> {
  if (!query || query.length < 3) return [];

  const body: Record<string, unknown> = {
    QueryText: query,
    MaxResults: 5,
    Language: 'es',
  };

  if (biasPosition) {
    body.BiasPosition = biasPosition;
  }

  try {
    const response = await fetch(`${PLACES_BASE}/suggest?key=${encodeURIComponent(API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Places API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const items: PlaceSuggestion[] = [];

    for (const item of (data.ResultItems ?? []) as AwsPlaceResultItem[]) {
      const point = item.Position;
      items.push({
        placeId: item.PlaceId ?? String(Math.random()),
        label: item.Address?.Label ?? item.Title ?? '',
        longitude: point?.[0] ?? 0,
        latitude: point?.[1] ?? 0,
      });
    }

    return items;
  } catch (err) {
    console.error('Error searching places:', err);
    return [];
  }
}

/**
 * Geocode a text query using the Places API v2 geocode endpoint.
 */
export async function geocodeText(
  query: string,
  biasPosition?: [number, number],
): Promise<PlaceSuggestion | null> {
  const body: Record<string, unknown> = {
    QueryText: query,
    MaxResults: 1,
    Language: 'es',
  };

  if (biasPosition) {
    body.BiasPosition = biasPosition;
  }

  try {
    const response = await fetch(`${PLACES_BASE}/geocode?key=${encodeURIComponent(API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const item = data.ResultItems?.[0] as AwsPlaceResultItem | undefined;
    if (!item || !item.Position) return null;

    return {
      placeId: item.PlaceId ?? '',
      label: item.Address?.Label ?? item.Title ?? query,
      longitude: item.Position[0],
      latitude: item.Position[1],
    };
  } catch (err) {
    console.error('Error geocoding:', err);
    return null;
  }
}

/**
 * Get the user's current geolocation with a fallback to Mexico City.
 */
export function getUserLocation(): Promise<[number, number]> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve([-99.1332, 19.4326]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve([position.coords.longitude, position.coords.latitude]),
      () => resolve([-99.1332, 19.4326]),
      { timeout: 5000 },
    );
  });
}
