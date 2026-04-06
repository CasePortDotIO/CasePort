import React from 'react';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import ArticleClient from './ArticleClient';

export default async function InsightsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 1, // Populatable relationships
  });

  const article = docs[0];

  if (!article) {
    notFound();
  }

  return <ArticleClient article={article} />;
}
