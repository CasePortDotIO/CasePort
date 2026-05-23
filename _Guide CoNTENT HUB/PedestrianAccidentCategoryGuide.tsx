import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function PedestrianAccidentCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'pedestrian-accident');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
