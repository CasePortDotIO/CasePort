import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function MotorcycleAccidentGuideNew() {
  const guide = guideCategories.find(g => g.id === 'motorcycle-accident');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
