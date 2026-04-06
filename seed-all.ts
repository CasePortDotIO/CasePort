import { getPayload } from "payload";
import config from "./src/payload.config.ts";
import fs from "fs";
import path from "path";
import https from "https";

import { articles } from "./src/lib/articles.ts";
import { articleContents } from "./src/lib/articleContent.ts";

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => { file.close(resolve); });
    }).on("error", (err) => { fs.unlink(dest, () => reject(err)); });
  });
}

function cleanSlug(str) { return str.toLowerCase().replace(/[^a-z0-9]/g, "-"); }

async function run() {
  const payload = await getPayload({ config });
  console.log("Publishing ALL dummy data to Payload...");

  const categoriesMap = new Map();
  const authorsMap = new Map();
  const mediaMap = new Map();
  
  const defaultImagePath = path.resolve("./dummy-image.jpg");
  if (!fs.existsSync(defaultImagePath)) {
    console.log("Downloading standard dummy image...");
    await downloadFile("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", defaultImagePath);
  }

  for (const article of articles) {
    console.log("Processing: " + article.title);
    
    let mediaId = mediaMap.get(article.thumbnail);
    if (!mediaId) {
        const localName = "thumb-" + cleanSlug(article.slug) + ".jpg";
        const localPath = path.resolve("./" + localName);
        try {
            await downloadFile(article.thumbnail, localPath);
            const media = await payload.create({
                collection: "media",
                data: { alt: article.title },
                file: {
                    data: fs.readFileSync(localPath),
                    mimetype: "image/jpeg",
                    name: localName,
                    size: fs.statSync(localPath).size,
                },
            });
            mediaId = media.id;
            mediaMap.set(article.thumbnail, mediaId);
            fs.unlinkSync(localPath);
        } catch (e) {
            console.log("Failed to download thumbnail, using default.");
            if (!mediaMap.has("default")) {
                const media = await payload.create({
                    collection: "media",
                    data: { alt: "Default Alt" },
                    file: {
                        data: fs.readFileSync(defaultImagePath),
                        mimetype: "image/jpeg",
                        name: "default.jpg",
                        size: fs.statSync(defaultImagePath).size,
                    },
                });
                mediaMap.set("default", media.id);
            }
            mediaId = mediaMap.get("default");
        }
    }
    
    let categoryNameRef = typeof article.category === "object" ? article.category.title : article.category;
    let categoryId = categoriesMap.get(categoryNameRef);
    if (!categoryId) {
        let titleParam = categoryNameRef || "Insight";
        const existingCat = await payload.find({ collection: "categories", where: { title: { equals: titleParam } }});
        if (existingCat.docs.length > 0) {
            categoryId = existingCat.docs[0].id;
        } else {
            const newCat = await payload.create({ collection: "categories", data: { title: titleParam, slug: cleanSlug(titleParam) }});
            categoryId = newCat.id;
        }
        categoriesMap.set(categoryNameRef, categoryId);
    }
    
    const authorName = typeof article.author === "object" ? article.author.name : (article.author || "CasePort Editorial");
    let authorId = authorsMap.get(authorName);
    if (!authorId) {
        const newAuthor = await payload.create({ collection: "authors", data: { name: authorName, title: "Contributor", bio: "A contributor on case acquisition and personal injury marketing strategy." }});
        authorId = newAuthor.id;
        authorsMap.set(authorName, authorId);
    }
    
    const existingArticle = await payload.find({ collection: "articles", where: { slug: { equals: article.slug } }});
    if (existingArticle.docs.length > 0) {
        console.log("Article " + article.slug + " already exists! Skipping...");
        continue;
    }
    
    const contentData = articleContents[article.slug];
    let richTextChildren = [];
    let takeawayList = [];
    let faqList = [];
    const readTimeNum = parseInt(article.readTime) || 5;

    if (contentData) {
        if (contentData.sections) {
            contentData.sections.forEach(sec => {
                if (sec.heading) richTextChildren.push({ type: "heading", tag: "h2", format: "", indent: 0, version: 1, children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: sec.heading, version: 1 }] });
                if (sec.paragraphs) sec.paragraphs.forEach(p => richTextChildren.push({ type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: p, version: 1 }] }));
                if (sec.blockquote) richTextChildren.push({ type: "quote", format: "", indent: 0, version: 1, children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: sec.blockquote, version: 1 }] });
            });
        }
        takeawayList = (contentData.keyTakeaways || []).map(t => ({ takeaway: t }));
        faqList = (contentData.faq || []).map(f => ({ question: f.question, answer: f.answer }));
    }
    
    if (richTextChildren.length === 0) {
        richTextChildren.push({ type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: article.excerpt || "Lorem ipsum...", version: 1 }] });
    }

    try {
      await payload.create({
          collection: "articles",
          data: {
              title: article.title,
              slug: article.slug,
              heroImage: mediaId,
              category: categoryId,
              author: authorId,
              readTime: readTimeNum,
              publishedAt: new Date(article.date).toISOString(),
              excerpt: article.excerpt,
              subtitle: contentData?.subtitle || article.excerpt,
              executiveSummary: contentData?.executiveSummary || "Executive Summary placeholder.",
              keyTakeaways: takeawayList,
              faqs: faqList,
              seoAnswers: [],
              content: { root: { type: "root", children: richTextChildren, direction: "ltr", format: "", indent: 0, version: 1 } }
          }
      });
      console.log("✓ Inserted: " + article.slug);
    } catch (err) {
      console.log("Error creating article " + article.slug + ":", err.message);
    }
  }

  console.log("All dummy data successfully seeded!");
  process.exit(0);
}

run().catch(console.error);
