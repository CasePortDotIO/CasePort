import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function WrongfulDeathCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'wrongful-death');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
