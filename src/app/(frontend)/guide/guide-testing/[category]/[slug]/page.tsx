import GuideArticleTesting from '../../GuideArticleTesting';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function GuideArticleTestingPage({ params }: PageProps) {
  const { category, slug } = await params;
  return <GuideArticleTesting categorySlug={category} articleSlug={slug} />;
}