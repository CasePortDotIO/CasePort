import CategoryGuideTemplate from '@/components/CategoryGuideTemplate';
import guideCategories from '@/data/guideData';

export default function MedicalMalpracticeCategoryGuide() {
  const category = guideCategories.find(c => c.id === 'medical-malpractice');
  if (!category) return <div>Category not found</div>;
  return <CategoryGuideTemplate category={category} />;
}
