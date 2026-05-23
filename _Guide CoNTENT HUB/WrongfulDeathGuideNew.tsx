import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function WrongfulDeathGuideNew() {
  const guide = guideCategories.find(g => g.id === 'wrongful-death');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
