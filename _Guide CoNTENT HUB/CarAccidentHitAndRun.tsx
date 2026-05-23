import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function CarAccidentHitAndRun() {
  const guide = guideCategories.find(g => g.id === 'car-accident-hit-and-run');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
