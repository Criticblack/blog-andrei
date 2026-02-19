import { getPostsByCategory } from '@/lib/queries';
import CategoryPage from '@/components/CategoryPage';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export const metadata = {
  title: 'Blog — Andrei',
  description: 'Texte și gânduri scrise despre filosofie, disciplină și viață.',
};

export default async function BlogPage() {
  const { category, posts } = await getPostsByCategory('blog');
  if (!category) notFound();
  return <CategoryPage category={category} posts={posts} />;
}
