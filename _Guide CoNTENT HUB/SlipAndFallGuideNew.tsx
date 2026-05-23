import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function SlipAndFallGuideNew() {
  const guide = guideCategories.find(g => g.id === 'slip-and-fall');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
