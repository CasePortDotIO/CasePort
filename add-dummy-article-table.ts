import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  // Find an existing article to clone its required fields
  console.log('Fetching an existing article to copy required fields...')
  const existingArticles = await payload.find({
    collection: 'articles',
    limit: 1,
  })

  let newArticleData: any = {}

  if (existingArticles.docs.length > 0) {
    const base = existingArticles.docs[0]
    console.log(`Found base article for cloning: ${base.title}`)

    // Create a new article based on the existing one, modifying title, slug, and content
    newArticleData = {
      ...base,
      id: undefined, // remove id so we create a new one
      title: 'Dummy Article with Table Data',
      slug: 'dummy-article-with-table-' + Date.now(),
      status: 'draft',

      // Overwrite the content to include a Lexical Table
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'This is a sample article demonstrating the Lexical Table feature',
                  type: 'text',
                  version: 1,
                },
              ],
            },
            {
              type: 'table',
              format: '',
              indent: 0,
              version: 1,
              direction: null,
              children: [
                {
                  type: 'tablerow',
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: null,
                  children: [
                    {
                      type: 'tablecell',
                      headerState: 1, // Header cell
                      format: '',
                      indent: 0,
                      version: 1,
                      direction: null,
                      width: 200,
                      colSpan: 1,
                      rowSpan: 1,
                      children: [
                        {
                          type: 'paragraph',
                          format: '',
                          indent: 0,
                          version: 1,
                          direction: 'ltr',
                          children: [
                            {
                              detail: 0,
                              format: 1,
                              mode: 'normal',
                              style: '',
                              text: 'Feature',
                              type: 'text',
                              version: 1,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tablecell',
                      headerState: 1, // Header cell
                      format: '',
                      indent: 0,
                      version: 1,
                      direction: null,
                      width: 200,
                      colSpan: 1,
                      rowSpan: 1,
                      children: [
                        {
                          type: 'paragraph',
                          format: '',
                          indent: 0,
                          version: 1,
                          direction: 'ltr',
                          children: [
                            {
                              detail: 0,
                              format: 1,
                              mode: 'normal',
                              style: '',
                              text: 'Details',
                              type: 'text',
                              version: 1,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tablerow',
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: null,
                  children: [
                    {
                      type: 'tablecell',
                      headerState: 0,
                      format: '',
                      indent: 0,
                      version: 1,
                      direction: null,
                      width: 200,
                      colSpan: 1,
                      rowSpan: 1,
                      children: [
                        {
                          type: 'paragraph',
                          format: '',
                          indent: 0,
                          version: 1,
                          direction: 'ltr',
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Lexical Table',
                              type: 'text',
                              version: 1,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tablecell',
                      headerState: 0,
                      format: '',
                      indent: 0,
                      version: 1,
                      direction: null,
                      width: 200,
                      colSpan: 1,
                      rowSpan: 1,
                      children: [
                        {
                          type: 'paragraph',
                          format: '',
                          indent: 0,
                          version: 1,
                          direction: 'ltr',
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Successfully Added!',
                              type: 'text',
                              version: 1,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    }

    // Ensure relationship fields only pass their ID
    if (newArticleData.author && typeof newArticleData.author === 'object') {
      newArticleData.author = newArticleData.author.id
    }
    if (newArticleData.heroImage && typeof newArticleData.heroImage === 'object') {
      newArticleData.heroImage = newArticleData.heroImage.id
    }
    if (newArticleData.category && typeof newArticleData.category === 'object') {
      newArticleData.category = newArticleData.category.id
    }
  } else {
    console.error(
      'No existing articles found to copy structure from. Since Articles has many strictly required fields (AEO, SEO, excerpt, images, etc.), please create at least one article manually first so it can be cloned.',
    )
    process.exit(1)
  }

  try {
    const inserted = await payload.create({
      collection: 'articles',
      data: newArticleData,
    })

    console.log(`\n✅ Successfully created dummy article containing a Lexical table!`)
    console.log(`Document ID: ${inserted.id}`)
    console.log(`Title: ${inserted.title}`)
    console.log(`Slug: ${inserted.slug}`)
  } catch (error) {
    console.error('\n❌ Failed to insert dummy article:', error)
  }

  process.exit(0)
}

run()
