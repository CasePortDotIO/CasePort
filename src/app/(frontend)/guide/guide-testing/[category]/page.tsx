import CategoryGuideTesting from '../CategoryGuideTesting';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryGuideTestingPage({ params }: PageProps) {
  const { category } = await params;
  return <CategoryGuideTesting categorySlug={category} />;
}