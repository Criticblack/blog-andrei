import { createClient } from '@supabase/supabase-js';
import RoadmapView from './RoadmapView';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const revalidate = 60;

export const metadata = {
  title: 'Roadmap — Andrei',
  description: 'Ce studiez acum și ce urmează. Parcursul meu prin filosofie.',
};

export default async function RoadmapPage() {
  const { data: topics } = await supabase
    .from('roadmap_topics')
    .select('*, roadmap_items(*)')
    .order('sort_order', { ascending: true });

  // Sort items inside each topic
  const sorted = (topics || []).map(t => ({
    ...t,
    roadmap_items: (t.roadmap_items || []).sort((a, b) => a.sort_order - b.sort_order),
  }));

  return <RoadmapView topics={sorted} />;
}
