import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function WorkplaceInjuryCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'workplace-injury');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
