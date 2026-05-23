import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function CarAccidentCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'car-accident');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
