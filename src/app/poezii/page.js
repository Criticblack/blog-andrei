import { getPostsByCategory } from '@/lib/queries';
import CategoryPage from '@/components/CategoryPage';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export const metadata = {
  title: 'Poezii — Andrei',
  description: 'Versuri, poezii și gânduri în rimă.',
};

export default async function PoeziiPage() {
  const { category, posts } = await getPostsByCategory('poezii');
  if (!category) notFound();
  return <CategoryPage category={category} posts={posts} />;
}
