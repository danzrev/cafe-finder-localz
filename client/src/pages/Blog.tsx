import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostSummary, Paginated } from '@cafefinder/shared';
import { blogApi } from '@/services/api';
import { Card, CardMedia, EmptyState, ErrorState, LoadingState } from '@/components';
import { useDocumentTitle } from '@/hooks';
import { formatDate } from '@/utils/format';

export default function BlogPage() {
  useDocumentTitle('Journal');
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    blogApi
      .list({ pageSize: 20 })
      .then((res: Paginated<PostSummary>) => setPosts(res.items))
      .catch(setError);
  }, []);

  return (
    <div className="container-page py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">The Journal</h1>
        <p className="mt-2 max-w-xl text-cocoa">
          Field notes from the Davao coffee scene — new places, brew guides, and stories behind the
          beans.
        </p>
      </header>

      {error ? (
        <ErrorState onRetry={() => setError(null)} />
      ) : posts ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group focus-ring rounded-dewdrop">
              <Card className="overflow-hidden">
                <CardMedia src={post.coverImageUrl} alt={post.title} className="aspect-[16/9]" />
                <div className="p-5">
                  <p className="mb-2 text-xs text-cocoa-light">
                    {post.author.name ?? 'Café Finder'} · {post.publishedAt ? formatDate(post.publishedAt) : 'Soon'}
                  </p>
                  <h2 className="font-display text-xl font-semibold leading-snug group-hover:text-leaf-deep">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-cocoa">{post.excerpt}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <LoadingState label="Opening the journal…" />
      )}

      {posts && posts.length === 0 && (
        <div className="py-16">
          <EmptyState title="No posts yet" description="Check back soon." />
        </div>
      )}
    </div>
  );
}