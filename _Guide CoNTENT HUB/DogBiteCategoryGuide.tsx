import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function DogBiteCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'dog-bite');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
