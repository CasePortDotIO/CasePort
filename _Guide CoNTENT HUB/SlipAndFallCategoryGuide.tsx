import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function SlipAndFallCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'slip-and-fall');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
