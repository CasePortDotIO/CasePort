import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function CarAccidentMultiVehicle() {
  const guide = guideCategories.find(g => g.id === 'car-accident-multi-vehicle');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
