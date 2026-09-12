import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

/** Build an openingHours object open every day within the given range. */
function openDaily(open: string, close: string) {
  const day = { open, close };
  return { monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day };
}

/**
 * Seeds an admin account and a handful of sample cafés so the app has data to
 * browse on first run. Idempotent — safe to re-run.
 */
async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@cafefinder.ph';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const passwordHash = await hash(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: 'Admin', role: 'ADMIN' },
  });

  const sampleCafes = [
    {
      name: 'Blue Wonder Coffee Bar',
      slug: 'blue-wonder-coffee-bar',
      tagline: 'Specialty brews in a heritage house',
      description:
        'A cozy roastery in Uyanguren pouring single-origin Mount Apo arabica. Come for the pour-overs, stay for the vinyl.',
      district: 'Uyanguren',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0706,
      longitude: 125.6077,
      amenities: ['Free Wi‑Fi', 'Outdoor seating', 'Power outlets', 'Takeout'],
      tags: ['Specialty', 'Roastery', 'Vinyl'],
      openingHours: openDaily('07:00', '22:00'),
    },
    {
      name: 'Purge Coffee Roasters',
      slug: 'purge-coffee-roasters',
      tagline: 'Third-wave coffee, second home',
      description:
        'Clean, modern space with solid Wi‑Fi and a rotating menu of local roasts. A favorite for remote work.',
      district: 'Buhangin',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0988,
      longitude: 125.6203,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Takeout'],
      tags: ['Third wave', 'Remote work'],
      openingHours: openDaily('08:00', '21:00'),
    },
    {
      name: 'Cacao & Spice Cafe',
      slug: 'cacao-and-spice-cafe',
      tagline: 'Where Davao cacao meets great drip coffee',
      description:
        'Riverside patio, strong drip, and tables built from reclaimed wood. Lovely at sunset.',
      district: 'Lanang',
      status: 'APPROVED' as const,
      priceLevel: 3,
      latitude: 7.1081,
      longitude: 125.6415,
      amenities: ['Outdoor seating', 'Pet friendly'],
      tags: ['Riverside', 'Cacao'],
      openingHours: openDaily('09:00', '23:00'),
    },
  ];

  for (const c of sampleCafes) {
    await prisma.cafe.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        tagline: c.tagline,
        description: c.description,
        district: c.district,
        status: c.status,
        priceLevel: c.priceLevel,
        latitude: c.latitude,
        longitude: c.longitude,
        amenities: c.amenities,
        tags: c.tags,
        openingHours: c.openingHours,
        ownerId: admin.id,
        images: {
          create: [
            { url: '', alt: `${c.name} exterior`, isCover: true },
          ],
        },
      },
    });
  }

  // A starter journal post.
  await prisma.blogPost.upsert({
    where: { slug: 'davao-coffee-passes-a-where-to-start' },
    update: {},
    create: {
      slug: 'davao-coffee-passes-a-where-to-start',
      title: 'Davao’s Coffee Passes, a Where-to-Start',
      excerpt: 'A short field guide to the cafés worth a detour on your next Davao run.',
      body:
        'Davao is quietly becoming one of the Philippines’ most interesting coffee cities. ' +
        'Between the arabica grown high on Mount Apo and a generation of young roasters, ' +
        'there is more to love here every year.\n\nThis guide is the start — we’ll keep it updated ' +
        'as new spots open, and as the classics hold up their end of the bar.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: ['guides', 'davao'],
      authorId: admin.id,
    },
  });

  console.log('✔ Seeded admin user and sample cafés.');
  console.log(`  Admin login → ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });