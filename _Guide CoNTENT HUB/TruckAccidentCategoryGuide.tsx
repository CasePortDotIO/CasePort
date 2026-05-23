import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function TruckAccidentCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'truck-accident');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
