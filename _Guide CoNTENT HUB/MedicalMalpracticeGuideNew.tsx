import GuideTemplate from '@/components/GuideTemplate';
import guideCategories from '@/data/guideData';

export default function MedicalMalpracticeGuideNew() {
  const guide = guideCategories.find(g => g.id === 'medical-malpractice');
  if (!guide) return <div>Guide not found</div>;
  return <GuideTemplate guide={guide} />;
}
