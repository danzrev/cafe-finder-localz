import { Button } from '@/components';
import { useDocumentTitle } from '@/hooks';

const PILLARS = [
  {
    title: 'Community-sourced',
    body: 'Every listing starts with someone who loves the place. Locals add cafés, we verify, and everyone benefits.',
  },
  {
    title: 'Independently minded',
    body: 'We’re partial to family-run roasteries and corner shops — the places that give Davao its coffee character.',
  },
  {
    title: 'Honest reviews',
    body: 'Real ratings from real visits. No paid placements, no fluff.',
  },
];

export default function AboutPage() {
  useDocumentTitle('About');
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">About Café Finder Localz</h1>
      <p className="mt-4 text-lg leading-relaxed text-cocoa">
        Caffeine culture runs deep in Davao City. From the arabica grown on the slopes of Mount Apo
        to the single-origin shops along the Sabang area, there’s a story in every cup. Café Finder
        Localz is our attempt to map that story — café by café.
      </p>

      <div className="mt-12 space-y-6">
        {PILLARS.map((p, i) => (
          <div key={p.title} className="grid gap-2 sm:grid-cols-[48px_1fr]">
            <span className="font-display text-2xl font-semibold text-leaf">{`0${i + 1}`}</span>
            <div>
              <h2 className="font-display text-xl font-semibold">{p.title}</h2>
              <p className="mt-1 max-w-prose leading-relaxed text-cocoa">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-dewdrop bg-latte-light p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Found a café we’re missing?</h2>
        <p className="mx-auto mt-2 max-w-md text-cocoa">
          We’d love to know. Add it and help the guide keep growing.
        </p>
        <div className="mt-5 flex justify-center">
          <Button onClick={() => (window.location.href = '/submit')}>Add a café</Button>
        </div>
      </div>
    </div>
  );
}