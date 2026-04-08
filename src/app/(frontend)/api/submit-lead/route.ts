import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const formData = await req.formData()

    // Extract text fields
    const data: Record<string, any> = {}

    // Extract files explicitly
    const files = formData.getAll('documents')
    const uploadedMediaIds: any[] = []

    // Map through fields
    formData.forEach((value, key) => {
      if (key !== 'documents') {
        data[key] = value
      }
    })

    // Upload each attached file securely to the Media collection
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer())

        // Use local payload API to bypass 'registered only' create access rules on Media
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: `Document from ${data.firstName || ''} ${data.lastName || 'Lead'}`,
          },
          file: {
            data: buffer,
            name: file.name,
            mimetype: file.type,
            size: file.size,
          },
        })

        // Collect uploaded Media IDs
        uploadedMediaIds.push(media.id)
      }
    }

    // Attach document relationships if any were uploaded
    if (uploadedMediaIds.length > 0) {
      data.uploadedDocuments = uploadedMediaIds
    }

    // Submit Lead Data
    const lead = await payload.create({
      collection: 'injured-leads',
      data: data as any, // Typecast since dynamic string mapping satisfies our schema
    })

    return Response.json(lead, { status: 201 })
  } catch (error) {
    console.error('Lead submission error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 },
    )
  }
}
