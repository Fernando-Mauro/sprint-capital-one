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

interface GeoRawResult {
  PlaceId?: string;
  Place?: {
    Label?: string;
    Geometry?: {
      Point?: [number, number];
    };
  };
}

/**
 * Search for places by text using Amazon Location Places API v2.
 * Uses the suggest endpoint for autocomplete.
 */
export async function searchPlaces(
  query: string,
  biasPosition?: [number, number],
): Promise<PlaceSuggestion[]> {
  if (!query || query.length < 3) return [];

  const params = new URLSearchParams({
    key: API_KEY,
    'query-text': query,
    'max-results': '5',
    language: 'es',
  });

  if (biasPosition) {
    params.set('bias-position', `${biasPosition[0]},${biasPosition[1]}`);
  }

  try {
    const response = await fetch(
      `https://places.geo.${REGION}.amazonaws.com/v2/suggest?${params.toString()}`,
    );
    if (!response.ok) {
      console.error('Places API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const items: PlaceSuggestion[] = [];

    for (const item of data.ResultItems ?? []) {
      const place = item.Place ?? item;
      const point = place?.Position ?? place?.Geometry?.Point;
      if (point && Array.isArray(point)) {
        items.push({
          placeId: item.PlaceId ?? String(Math.random()),
          label: place.Address?.Label ?? place.Title ?? item.Title ?? '',
          longitude: point[0],
          latitude: point[1],
        });
      } else if (item.Title) {
        // Suggest results may just be text — resolve with geocode on click
        items.push({
          placeId: item.PlaceId ?? String(Math.random()),
          label: item.Title,
          longitude: 0,
          latitude: 0,
        });
      }
    }

    return items;
  } catch (err) {
    console.error('Error searching places:', err);
    return [];
  }
}

/**
 * Geocode a text query using the Places API v2 geocode endpoint.
 * Returns the best match with lat/lng.
 */
export async function geocodeText(
  query: string,
  biasPosition?: [number, number],
): Promise<PlaceSuggestion | null> {
  const params = new URLSearchParams({
    key: API_KEY,
    'query-text': query,
    'max-results': '1',
    language: 'es',
  });

  if (biasPosition) {
    params.set('bias-position', `${biasPosition[0]},${biasPosition[1]}`);
  }

  try {
    const response = await fetch(
      `https://places.geo.${REGION}.amazonaws.com/v2/geocode?${params.toString()}`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    const item = data.ResultItems?.[0];
    if (!item) return null;

    const point = item.Position;
    if (!point) return null;

    return {
      placeId: item.PlaceId ?? '',
      label: item.Address?.Label ?? item.Title ?? query,
      longitude: point[0],
      latitude: point[1],
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
      resolve([-99.1332, 19.4326]); // Mexico City
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve([position.coords.longitude, position.coords.latitude]),
      () => resolve([-99.1332, 19.4326]),
      { timeout: 5000 },
    );
  });
}

interface GeoRawResult_ {
  _: GeoRawResult;
}
export type { GeoRawResult_ };
