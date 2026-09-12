import { PostStatus } from '../enums';

/** A blog post summary for list pages. */
export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  author: { id: string; name: string | null };
  publishedAt: string | null;
}

/** Full blog post for the article page. */
export interface PostDetail extends PostSummary {
  body: string;
  status: PostStatus;
  tags: string[];
  updatedAt: string;
}

/** DTO for creating/updating a post (admin or editors). */
export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImageUrl?: string;
  tags?: string[];
  status?: PostStatus;
}