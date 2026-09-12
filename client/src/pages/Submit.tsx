import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAVAO_DISTRICTS } from '@cafefinder/shared';
import { cafesApi } from '@/services/api';
import { ApiError } from '@/api/client';
import { Button, ErrorState, Field, Input, Select, Textarea } from '@/components';
import { useDocumentTitle } from '@/hooks';

const AMENITY_OPTIONS = ['Free Wi‑Fi', 'Outdoor seating', 'Pet friendly', 'Power outlets', 'Takeout'];

export default function SubmitPage() {
  useDocumentTitle('Add a café');
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    tagline: '',
    description: '',
    address: '',
    district: '',
    city: 'Davao City',
    priceLevel: 2 as 1 | 2 | 3,
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | string | null>(null);

  const handleAmenity = (option: string) =>
    setAmenities((prev) =>
      prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const cafe = await cafesApi.create({
        name: values.name.trim(),
        tagline: values.tagline || undefined,
        description: values.description || undefined,
        address: values.address || undefined,
        district: values.district || undefined,
        city: values.city,
        priceLevel: values.priceLevel,
        amenities,
      });
      navigate(`/cafe/${cafe.slug}`);
    } catch (err) {
      setError(err as ApiError | string);
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page max-w-3xl py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Add a café</h1>
        <p className="mt-2 text-cocoa">
          Community-powered means you. Share a spot worth knowing — we’ll review it before it goes
          live.
        </p>
      </header>

      {error && typeof error === 'object' && 'message' in error ? (
        <div className="mb-6">
          <ErrorState title="Couldn’t submit" message={(error as ApiError).message} />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Café name" required>
          <Input
            required
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="e.g. Purge Coffee Roasters"
            maxLength={80}
          />
        </Field>

        <Field label="Tagline" hint="A short line that captures the place.">
          <Input
            value={values.tagline}
            onChange={(e) => setValues({ ...values, tagline: e.target.value })}
            placeholder="e.g. Specialty brews in a heritage house"
            maxLength={120}
          />
        </Field>

        <Field label="Description">
          <Textarea
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            placeholder="What makes this café special? The vibe, the beans, the food, the neighbors…"
            maxLength={1000}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Address">
            <Input
              value={values.address}
              onChange={(e) => setValues({ ...values, address: e.target.value })}
              placeholder="Street, building"
            />
          </Field>
          <Field label="District">
            <Select
              value={values.district}
              onChange={(e) => setValues({ ...values, district: e.target.value })}
            >
              <option value="">Select district</option>
              {DAVAO_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Price level">
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setValues({ ...values, priceLevel: lvl })}
                className={`flex-1 rounded-xl border px-4 py-2 text-sm transition-colors focus-ring ${
                  values.priceLevel === lvl
                    ? 'border-leaf bg-leaf/10 text-leaf-deep'
                    : 'border-espresso/15 text-cocoa hover:border-espresso/30'
                }`}
              >
                {'$'.repeat(lvl)}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => handleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-ring ${
                  amenities.includes(a)
                    ? 'border-leaf bg-leaf/10 text-leaf-deep'
                    : 'border-espresso/15 text-cocoa hover:border-espresso/30'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex justify-end">
          <Button type="submit" loading={submitting}>
            Submit for review
          </Button>
        </div>
      </form>
    </div>
  );
}