import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ScrapedCafeData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  priceLevel: 1 | 2 | 3;
  status: 'PENDING';
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  amenities: string[];
  tags: string[];
  openingHours?: Record<string, { open: string; close: string }>;
  coverImage?: string;
  images?: string[];
  metadata: {
    source: string;
    scrapedAt: string;
    googleRating?: number;
    googleReviewCount?: number;
  };
}

/**
 * Import scraped cafés into the database
 */
async function importScrapedCafes() {
  console.log('📥 Importing scraped cafés into database...\n');

  // Read the scraped data
  const dataPath = path.join(process.cwd(), 'prisma', 'scraped-cafes.json');

  if (!fs.existsSync(dataPath)) {
    console.error('❌ scraped-cafes.json not found!');
    console.error('Please run the scraper first: npx tsx src/scraper/googlePlacesScraper.ts');
    process.exit(1);
  }

  const scrapedCafes: ScrapedCafeData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Found ${scrapedCafes.length} cafés to import\n`);

  // Find or create a system user for scraped cafés
  let systemUser = await prisma.user.findFirst({
    where: { email: 'system@cafefinder.ph' },
  });

  if (!systemUser) {
    console.log('Creating system user for scraped cafés...');
    systemUser = await prisma.user.create({
      data: {
        email: 'system@cafefinder.ph',
        name: 'System (Auto-scraped)',
        role: 'USER',
        passwordHash: '', // No password - can't login
      },
    });
  }

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const cafe of scrapedCafes) {
    try {
      // Check if café already exists by slug or name
      const existing = await prisma.cafe.findFirst({
        where: {
          OR: [
            { slug: cafe.slug },
            { name: cafe.name },
          ],
        },
      });

      if (existing) {
        console.log(`⏭️  Skipping "${cafe.name}" - already exists`);
        skipped++;
        continue;
      }

      // Create the café
      await prisma.cafe.create({
        data: {
          name: cafe.name,
          slug: cafe.slug,
          tagline: cafe.tagline,
          description: cafe.description,
          address: cafe.address,
          district: cafe.district,
          latitude: cafe.latitude,
          longitude: cafe.longitude,
          priceLevel: cafe.priceLevel,
          status: cafe.status,
          phone: cafe.phone,
          website: cafe.website,
          amenities: cafe.amenities,
          tags: cafe.tags,
          openingHours: cafe.openingHours || {},
          ownerId: systemUser.id,
          images: {
            create: [
              ...(cafe.coverImage
                ? [{
                    url: cafe.coverImage,
                    alt: `${cafe.name} - exterior view`,
                    isCover: true,
                  }]
                : []),
              ...(cafe.images?.map((url, index) => ({
                url,
                alt: `${cafe.name} - interior ${index + 1}`,
                isCover: false,
              })) || []),
            ],
          },
        },
      });

      console.log(`✅ Imported "${cafe.name}" (${cafe.district})`);
      imported++;

    } catch (error) {
      console.error(`❌ Error importing "${cafe.name}":`, error instanceof Error ? error.message : error);
      errors++;
    }
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`✅ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Errors:   ${errors}`);
  console.log('━'.repeat(50));
  console.log('\n📝 Next steps:');
  console.log('1. Login as admin: admin@cafefinder.ph / ChangeMe123!');
  console.log('2. Go to /admin to review and approve cafés');
  console.log('3. Café owners can claim their listings from the café detail page\n');
}

importScrapedCafes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
