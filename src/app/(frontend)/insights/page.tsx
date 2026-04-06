import { getPayload } from 'payload';
import configPromise from '@payload-config';
import InsightsClient from './InsightsClient';

export default async function InsightsPage() {
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: 'articles',
    depth: 1, // Populatable relationships
    sort: '-publishedAt',
  });

  return <InsightsClient fetchedArticles={docs} />;
}
