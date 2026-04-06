import { getPayload } from 'payload';
import config from './src/payload.config.js';
import fs from 'fs';
import path from 'path';
import https from 'https';

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const payload = await getPayload({ config });

  console.log('Publishing dummy data to Payload...');

  // 1. Create Media (Placeholder Image)
  const imagePath = path.resolve('./dummy-image.jpg');
  if (!fs.existsSync(imagePath)) {
    console.log('Downloading dummy image...');
    await downloadFile('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', imagePath);
  }

  const media = await payload.create({
    collection: 'media',
    data: { alt: 'Hero image placeholder' },
    file: {
      data: fs.readFileSync(imagePath),
      mimetype: 'image/jpeg',
      name: 'hero-image.jpg',
      size: fs.statSync(imagePath).size,
    },
  });

  console.log('✓ Media created:', media.id);

  // 2. Create Category
  const category = await payload.create({
    collection: 'categories',
    data: {
      title: 'Law Firm Business',
      slug: 'law-firm-business',
      description: 'Insights on scaling and managing law firms.',
    },
  });
  console.log('✓ Category created:', category.id);

  // 3. Create Author
  const author = await payload.create({
    collection: 'authors',
    data: {
      name: 'The Observatory Desk',
      title: 'Senior Editorial Team',
      avatar: media.id,
      bio: 'With deep expertise in personal injury law operations, the team has advised 50+ firms on intake optimization and case acquisition strategy.',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
    },
  });
  console.log('✓ Author created:', author.id);

  // 4. Create Article
  const article = await payload.create({
    collection: 'articles',
    data: {
      title: 'The Future of Case Acquisition: AI and Automation',
      slug: 'future-of-case-acquisition',
      heroImage: media.id,
      category: category.id,
      author: author.id,
      readTime: 7,
      publishedAt: new Date().toISOString(),
      excerpt: 'Discover how artificial intelligence and data signaling are reshaping the intake process, turning expensive wide-net marketing into hyper-targeted strikes.',
      subtitle: 'Firms often blame weak outcomes on lead quality. In many cases, value is being lost after the inquiry arrives through response delay and routing friction.',
      executiveSummary: 'Intake leakage is rarely one dramatic failure. It is usually the cumulative result of small delays, weak routing rules, uneven qualification, and inconsistent follow-up.',
      keyTakeaways: [
        { takeaway: 'Intake leakage usually happens after the inquiry arrives, not before it.' },
        { takeaway: 'Small operational delays compound into lower retained case value over time.' },
      ],
      faqs: [
        { question: 'What is intake leakage?', answer: 'The loss of potential case value that occurs after a lead is generated but before the client is retained.' },
        { question: 'How can law firms fix it?', answer: 'By implementing automated routing, standardizing qualification scripts, and reducing response times.' }
      ],
      seoAnswers: [
        { question: 'What is case acquisition software?', answer: 'A system that allows law firms to securely and dynamically acquire cases.' }
      ],
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "heading",
              tag: "h2",
              format: "",
              indent: 0,
              version: 1,
              children: [
                { type: "text", detail: 0, format: 0, mode: "normal", style: "", text: "The End of Wide-Net Marketing", version: 1 }
              ]
            },
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                { type: "text", detail: 0, format: 0, mode: "normal", style: "", text: "For decades, personal injury acquisition relied on a simple but brutally expensive formula: blanket the airwaves, dominate billboards, and hope the right injury victims saw your message at the exact moment they needed a lawyer. It was marketing by sheer force.", version: 1 }
              ]
            },
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                { type: "text", detail: 0, format: 0, mode: "normal", style: "", text: "Today, that paradigm is fundamentally broken. With rising digital ad costs and extreme saturation in terrestrial markets, law firms can no longer afford to spend millions hoping to catch a fraction of viable cases.", version: 1 }
              ]
            }
          ]
        }
      }
    },
  });

  console.log('✓ Article created:', article.id);
  console.log('\nSeed successful! You can now check the CMS at http://localhost:3000/admin');
  process.exit(0);
}

run().catch(console.error);
