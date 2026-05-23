import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function PedestrianAccidentGuideNew() {
  const guide = guideCategories.find(g => g.id === 'pedestrian-accident');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
