import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PostDetail } from '@cafefinder/shared';
import { blogApi } from '@/services/api';
import { CardMedia, ErrorState, LoadingState } from '@/components';
import { useDocumentTitle } from '@/hooks';
import { formatDate } from '@/utils/format';

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useDocumentTitle(post?.title ?? 'Journal');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    blogApi
      .bySlug(slug)
      .then((p) => active && setPost(p))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <LoadingState className="container-page" label="Opening article…" />;
  if (error || !post)
    return (
      <div className="container-page py-16">
        <ErrorState message="We couldn’t find that article." onRetry={() => setError(null)} />
      </div>
    );

  return (
    <article className="container-page max-w-3xl py-12">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-cocoa hover:text-leaf-deep">
        <ArrowLeft className="h-4 w-4" /> Back to journal
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-cocoa">
        By {post.author.name ?? 'Café Finder'} · {post.publishedAt ? formatDate(post.publishedAt) : 'Soon'}
        {post.tags.length > 0 && (
          <span className="ml-2 inline-flex flex-wrap gap-1">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-latte px-2 py-0.5 text-xs">#{t}</span>
            ))}
          </span>
        )}
      </p>

      {post.coverImageUrl && (
        <div className="mt-8">
          <CardMedia src={post.coverImageUrl} alt={post.title} className="aspect-[16/9] rounded-dewdrop" />
        </div>
      )}

      <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-cocoa">{post.body}</p>
    </article>
  );
}