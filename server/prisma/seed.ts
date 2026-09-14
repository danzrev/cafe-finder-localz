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
      name: 'Blugre Coffee',
      slug: 'blugre-coffee',
      tagline: 'Davao\'s pioneering specialty coffee roaster',
      description:
        'One of the city\'s first specialty coffee shops, Blugre has been serving expertly roasted beans since 2012. Their signature cold brew and single-origin espresso from Mount Apo beans are legendary. The industrial-chic space is perfect for meetings or focused work.',
      district: 'Poblacion District',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0731,
      longitude: 125.6128,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Air conditioning', 'Takeout', 'Meeting rooms'],
      tags: ['Specialty coffee', 'Roastery', 'Cold brew', 'Remote work'],
      openingHours: openDaily('07:00', '22:00'),
      coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    },
    {
      name: 'Kape Almansi',
      slug: 'kape-almansi',
      tagline: 'Farm-to-cup coffee experience',
      description:
        'A beautiful garden cafe showcasing beans from their own farm in Calinan. Try their fruity natural-processed arabica or take a cupping session on weekends. The al fresco seating surrounded by tropical plants makes every visit feel like an escape.',
      district: 'Calinan',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.1822,
      longitude: 125.4556,
      amenities: ['Outdoor seating', 'Garden', 'Free Wi‑Fi', 'Farm tours', 'Pet friendly'],
      tags: ['Farm-to-cup', 'Garden cafe', 'Natural process', 'Weekend cupping'],
      openingHours: openDaily('08:00', '20:00'),
      coverImage: 'https://images.unsplash.com/photo-1559496417-e7f25c7e0542?w=800&h=600&fit=crop',
    },
    {
      name: 'Commune Cafe + Bar',
      slug: 'commune-cafe-bar',
      tagline: 'Where coffee meets cocktails',
      description:
        'By day, a bustling cafe serving excellent flat whites and avocado toast. By night, a sophisticated bar with coffee-infused cocktails. The communal tables and neon-lit space make it a hub for Davao\'s creative community.',
      district: 'Poblacion District',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0745,
      longitude: 125.6142,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Bar', 'Food menu', 'Air conditioning'],
      tags: ['Cafe bar', 'Cocktails', 'Brunch', 'Night spot', 'Community space'],
      openingHours: openDaily('09:00', '02:00'),
      coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    },
    {
      name: 'Kalsada Coffee',
      slug: 'kalsada-coffee',
      tagline: 'Philippine specialty coffee at its finest',
      description:
        'A renowned roastery bringing award-winning Philippine coffee to the world. Their Davao flagship offers precision brewing methods and barista workshops. The minimalist interior lets the coffee do the talking. Don\'t miss their signature gesha varieties.',
      district: 'Lanang',
      status: 'APPROVED' as const,
      priceLevel: 3,
      latitude: 7.1056,
      longitude: 125.6389,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Air conditioning', 'Workshops', 'Coffee education'],
      tags: ['Specialty coffee', 'Roastery', 'Gesha', 'Award-winning', 'Barista workshops'],
      openingHours: openDaily('08:00', '21:00'),
      coverImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
    },
    {
      name: 'The Steam Room',
      slug: 'the-steam-room',
      tagline: 'Industrial vibes, artisan coffee',
      description:
        'A spacious industrial loft with exposed brick walls and floor-to-ceiling windows. Known for their rich espresso-based drinks and house-made pastries. The upstairs area is quieter for those needing to work, while the ground floor buzzes with energy.',
      district: 'Matina',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0578,
      longitude: 125.5889,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Two floors', 'Pastries', 'Air conditioning'],
      tags: ['Industrial design', 'Loft space', 'Espresso bar', 'Pastries', 'Work-friendly'],
      openingHours: openDaily('07:30', '22:00'),
      coverImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop',
    },
    {
      name: 'Cafe Demitasse',
      slug: 'cafe-demitasse',
      tagline: 'Japanese-inspired coffee haven',
      description:
        'A serene Japanese-style cafe with tatami seating options and zen garden views. Their siphon coffee and matcha lattes are prepared with ceremonial precision. The quiet atmosphere and minimalist design make it ideal for contemplative afternoons.',
      district: 'Ecoland',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0923,
      longitude: 125.6201,
      amenities: ['Free Wi‑Fi', 'Garden view', 'Tatami seating', 'Siphon coffee', 'Quiet zone'],
      tags: ['Japanese style', 'Zen garden', 'Siphon coffee', 'Matcha', 'Peaceful'],
      openingHours: openDaily('10:00', '21:00'),
      coverImage: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop',
    },
    {
      name: 'Penong\'s BBQ & Kape',
      slug: 'penongs-bbq-kape',
      tagline: 'Street food meets specialty coffee',
      description:
        'A uniquely Davao concept: award-winning BBQ paired with seriously good coffee. Start with their famous chicken BBQ then finish with a smooth iced americano. The casual outdoor setup captures the essence of Davao\'s laid-back food scene.',
      district: 'Bajada',
      status: 'APPROVED' as const,
      priceLevel: 1,
      latitude: 7.0689,
      longitude: 125.6234,
      amenities: ['Outdoor seating', 'BBQ food', 'Takeout', 'Street food', 'Casual dining'],
      tags: ['BBQ', 'Street food', 'Local favorite', 'Casual', 'Filipino cuisine'],
      openingHours: openDaily('15:00', '00:00'),
      coverImage: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&h=600&fit=crop',
    },
    {
      name: 'Lola Sisa Cafe',
      slug: 'lola-sisa-cafe',
      tagline: 'Heritage house turned cozy coffee nook',
      description:
        'Tucked in a restored 1950s house, this charming cafe serves traditional Davao pastries alongside modern coffee drinks. The vintage furniture and old family photos create a nostalgic ambiance. Try their ube latte and bibingka pairing.',
      district: 'Uyanguren',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0698,
      longitude: 125.6156,
      amenities: ['Heritage house', 'Vintage decor', 'Traditional pastries', 'Photo-worthy', 'Air conditioning'],
      tags: ['Heritage', 'Vintage', 'Traditional pastries', 'Filipino fusion', 'Instagrammable'],
      openingHours: openDaily('08:00', '20:00'),
      coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    },
    {
      name: 'Kopiroti',
      slug: 'kopiroti',
      tagline: 'Filipino coffee meets homemade roti',
      description:
        'A cozy neighborhood spot famous for pairing Philippine single-origin coffee with Malaysian-style roti. The owner roasts beans weekly and makes roti fresh daily. Popular with students and freelancers for the affordable prices and reliable WiFi.',
      district: 'Juna Subdivision',
      status: 'APPROVED' as const,
      priceLevel: 1,
      latitude: 7.0856,
      longitude: 125.6178,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Budget-friendly', 'Fresh roti', 'Student-friendly'],
      tags: ['Budget-friendly', 'Roti', 'Local roast', 'Study spot', 'Neighborhood cafe'],
      openingHours: openDaily('07:00', '22:00'),
      coverImage: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    },
    {
      name: 'The Good Cup Coffee Company',
      slug: 'the-good-cup-coffee-company',
      tagline: 'Ethical coffee, exceptional taste',
      description:
        'A social enterprise cafe working directly with indigenous coffee farmers in Mindanao. Every cup supports fair wages and sustainable farming. The bright, modern space features rotating art from local artists. Their cascara tea and honey-processed coffee are standouts.',
      district: 'Obrero',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.0645,
      longitude: 125.6089,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Fair trade', 'Art gallery', 'Social impact'],
      tags: ['Social enterprise', 'Fair trade', 'Indigenous coffee', 'Art space', 'Sustainable'],
      openingHours: openDaily('08:00', '21:00'),
      coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    },
    {
      name: 'Riverside Cafe Toril',
      slug: 'riverside-cafe-toril',
      tagline: 'Mountain views, riverside seating',
      description:
        'Located at the foot of Mount Apo, this cafe offers stunning views of the river and mountains. Perfect for weekend trips out of the city center. Their robusta brew is strong and earthy, perfect after a hike. The open-air bamboo structure keeps things cool.',
      district: 'Toril',
      status: 'APPROVED' as const,
      priceLevel: 1,
      latitude: 6.9234,
      longitude: 125.4978,
      amenities: ['Riverside seating', 'Mountain views', 'Outdoor', 'Nature setting', 'Pet friendly'],
      tags: ['Riverside', 'Mountain view', 'Nature', 'Weekend getaway', 'Open-air'],
      openingHours: openDaily('06:00', '18:00'),
      coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    },
    {
      name: 'Brew & Co.',
      slug: 'brew-and-co',
      tagline: 'Third-wave coffee meets local flavors',
      description:
        'A progressive cafe experimenting with local ingredients in coffee drinks. Try their calamansi cold brew or durian affogato for adventurous flavor combinations. The sleek interior and specialty equipment show serious dedication to the craft.',
      district: 'Lanang',
      status: 'APPROVED' as const,
      priceLevel: 2,
      latitude: 7.1034,
      longitude: 125.6445,
      amenities: ['Free Wi‑Fi', 'Power outlets', 'Innovative drinks', 'Air conditioning', 'Craft coffee'],
      tags: ['Third wave', 'Innovative', 'Local ingredients', 'Experimental', 'Craft coffee'],
      openingHours: openDaily('08:00', '22:00'),
      coverImage: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&h=600&fit=crop',
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
            { url: c.coverImage, alt: `${c.name} - cozy interior and seating`, isCover: true },
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