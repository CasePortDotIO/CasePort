import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function DogBiteGuideNew() {
  const guide = guideCategories.find(g => g.id === 'dog-bite');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
