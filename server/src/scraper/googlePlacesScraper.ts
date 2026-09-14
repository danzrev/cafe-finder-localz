import axios from 'axios';

/**
 * Google Places API scraper for fetching café data in Davao City
 *
 * Usage:
 * 1. Get a Google Places API key from https://console.cloud.google.com/
 * 2. Enable Places API (New) and Geocoding API
 * 3. Set GOOGLE_MAPS_API_KEY in .env
 * 4. Run: npx tsx src/scraper/googlePlacesScraper.ts
 */

interface PlaceResult {
  name: string;
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  types: string[];
  displayName: {
    text: string;
    languageCode: string;
  };
  priceLevel?: 'PRICE_LEVEL_FREE' | 'PRICE_LEVEL_INEXPENSIVE' | 'PRICE_LEVEL_MODERATE' | 'PRICE_LEVEL_EXPENSIVE' | 'PRICE_LEVEL_VERY_EXPENSIVE';
  regularOpeningHours?: {
    weekdayDescriptions: string[];
  };
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  currentOpeningHours?: {
    openNow: boolean;
  };
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  googleMapsUri?: string;
  editorialSummary?: {
    text: string;
  };
}

interface ScrapedCafe {
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  district?: string;
  priceLevel: 1 | 2 | 3;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  description?: string;
  openingHours?: string[];
  photos?: string[];
  isOpen?: boolean;
}

const DAVAO_DISTRICTS = [
  'Poblacion District',
  'Buhangin',
  'Bajada',
  'Obrero',
  'Uyanguren',
  'Matina',
  'Juna Subdivision',
  'Ecoland',
  'Lanang',
  'Mintal',
  'Toril',
  'Calinan',
];

/**
 * Convert place name to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Map Google price level to our 1-3 scale
 */
function mapPriceLevel(priceLevel?: string): 1 | 2 | 3 {
  switch (priceLevel) {
    case 'PRICE_LEVEL_FREE':
    case 'PRICE_LEVEL_INEXPENSIVE':
      return 1;
    case 'PRICE_LEVEL_MODERATE':
      return 2;
    case 'PRICE_LEVEL_EXPENSIVE':
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return 3;
    default:
      return 2; // Default to moderate
  }
}

/**
 * Extract district from address
 */
function extractDistrict(address: string): string | undefined {
  const addressLower = address.toLowerCase();

  for (const district of DAVAO_DISTRICTS) {
    if (addressLower.includes(district.toLowerCase())) {
      return district;
    }
  }

  // Try to extract from comma-separated parts
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return parts[parts.length - 2]; // Usually district is second to last
  }

  return undefined;
}

/**
 * Get photo URL from Google Places photo reference
 */
function getPhotoUrl(photoName: string, apiKey: string, maxWidth: number = 800): string {
  // Extract photo reference from name (format: places/{place_id}/photos/{photo_reference})
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
}

/**
 * Search for cafés in Davao City using Google Places API (New)
 */
export async function searchCafesInDavao(apiKey: string): Promise<ScrapedCafe[]> {
  const cafes: ScrapedCafe[] = [];

  // Davao City center coordinates
  const davaoCityCenter = {
    latitude: 7.0731,
    longitude: 125.6128,
  };

  const searchQueries = [
    'coffee shop in Davao City',
    'cafe in Davao City',
    'specialty coffee Davao',
    'coffee roastery Davao',
  ];

  console.log('🔍 Searching for cafés in Davao City...\n');

  for (const query of searchQueries) {
    try {
      console.log(`Searching: "${query}"...`);

      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: query,
          locationBias: {
            circle: {
              center: davaoCityCenter,
              radius: 15000, // 15km radius
            },
          },
          maxResultCount: 20,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.location,' +
              'places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,' +
              'places.regularOpeningHours,places.currentOpeningHours,places.photos,' +
              'places.websiteUri,places.nationalPhoneNumber,places.internationalPhoneNumber,' +
              'places.googleMapsUri,places.editorialSummary,places.types',
          },
        }
      );

      const places: PlaceResult[] = response.data.places || [];
      console.log(`✓ Found ${places.length} results\n`);

      for (const place of places) {
        // Filter: Must be a café/coffee shop
        if (!place.types.some(t =>
          ['cafe', 'coffee_shop', 'bakery', 'restaurant'].includes(t)
        )) {
          continue;
        }

        // Check if already added (by name)
        if (cafes.some(c => c.name === place.displayName.text)) {
          continue;
        }

        const cafe: ScrapedCafe = {
          name: place.displayName.text,
          slug: slugify(place.displayName.text),
          address: place.formattedAddress,
          latitude: place.location.latitude,
          longitude: place.location.longitude,
          district: extractDistrict(place.formattedAddress),
          priceLevel: mapPriceLevel(place.priceLevel),
          rating: place.rating,
          reviewCount: place.userRatingCount,
          phone: place.nationalPhoneNumber || place.internationalPhoneNumber,
          website: place.websiteUri,
          googleMapsUrl: place.googleMapsUri,
          description: place.editorialSummary?.text,
          openingHours: place.regularOpeningHours?.weekdayDescriptions,
          isOpen: place.currentOpeningHours?.openNow,
          photos: place.photos?.slice(0, 5).map(p => getPhotoUrl(p.name, apiKey)),
        };

        cafes.push(cafe);

        console.log(`📍 ${cafe.name}`);
        console.log(`   ${cafe.address}`);
        console.log(`   ${cafe.rating ? `⭐ ${cafe.rating} (${cafe.reviewCount} reviews)` : 'No ratings yet'}`);
        console.log('');
      }

      // Rate limiting: wait 1 second between queries
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Error searching "${query}":`, error.response?.data || error.message);
      } else {
        console.error(`❌ Error searching "${query}":`, error);
      }
    }
  }

  console.log(`\n✅ Total unique cafés found: ${cafes.length}\n`);

  return cafes;
}

/**
 * Convert scraped cafés to seed data format
 */
export function convertToSeedData(cafes: ScrapedCafe[]) {
  return cafes.map(cafe => ({
    name: cafe.name,
    slug: cafe.slug,
    tagline: cafe.description?.split('.')[0] || 'Great coffee in Davao City',
    description: cafe.description ||
      `Discover ${cafe.name}, a wonderful café serving quality coffee in ${cafe.district || 'Davao City'}.`,
    address: cafe.address,
    district: cafe.district || 'Davao City',
    latitude: cafe.latitude,
    longitude: cafe.longitude,
    priceLevel: cafe.priceLevel,
    status: 'PENDING' as const, // Requires admin approval
    phone: cafe.phone,
    website: cafe.website,
    googleMapsUrl: cafe.googleMapsUrl,
    amenities: ['Free Wi‑Fi', 'Takeout'], // Default amenities
    tags: ['Coffee shop', 'Café'],
    openingHours: parseOpeningHours(cafe.openingHours),
    coverImage: cafe.photos?.[0],
    images: cafe.photos?.slice(1),
    metadata: {
      source: 'google_places',
      scrapedAt: new Date().toISOString(),
      googleRating: cafe.rating,
      googleReviewCount: cafe.reviewCount,
    },
  }));
}

/**
 * Parse Google's weekday descriptions into our opening hours format
 */
function parseOpeningHours(descriptions?: string[]) {
  if (!descriptions || descriptions.length === 0) {
    return undefined;
  }

  // Example: "Monday: 8:00 AM – 10:00 PM"
  const openingHours: Record<string, { open: string; close: string }> = {};

  const dayMap: Record<string, string> = {
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday',
    Sunday: 'sunday',
  };

  for (const desc of descriptions) {
    const [day, hours] = desc.split(':').map(s => s.trim());

    if (hours === 'Closed') {
      continue;
    }

    const [open, close] = hours.split('–').map(s => s.trim());

    if (open && close && dayMap[day]) {
      openingHours[dayMap[day]] = {
        open: convertTo24Hour(open),
        close: convertTo24Hour(close),
      };
    }
  }

  return Object.keys(openingHours).length > 0 ? openingHours : undefined;
}

/**
 * Convert 12-hour time to 24-hour format
 */
function convertTo24Hour(time: string): string {
  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Main function - run the scraper
 */
async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('❌ GOOGLE_MAPS_API_KEY not found in environment variables');
    console.error('Please set it in server/.env file');
    process.exit(1);
  }

  console.log('☕ Davao City Café Scraper\n');
  console.log('━'.repeat(50));
  console.log('');

  const cafes = await searchCafesInDavao(apiKey);
  const seedData = convertToSeedData(cafes);

  // Save to JSON file
  const fs = await import('fs');
  const path = await import('path');

  const outputPath = path.join(process.cwd(), 'prisma', 'scraped-cafes.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));

  console.log('━'.repeat(50));
  console.log(`✅ Scraped data saved to: ${outputPath}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the scraped data in prisma/scraped-cafes.json`);
  console.log(`2. Run the import script to add cafés to database`);
  console.log(`3. Admin can approve cafés from the admin panel`);
  console.log(`4. Owners can claim their cafés\n`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
