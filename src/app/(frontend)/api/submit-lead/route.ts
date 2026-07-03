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

    // Handle array fields (treatmentTypes, injuryTypes, preferredContactTime)
    // These come as repeated form fields - need to group them
    const arrayFields = ['treatmentTypes', 'injuryTypes', 'preferredContactTime']
    for (const field of arrayFields) {
      const values = formData.getAll(field)
      if (values.length > 0) {
        data[field] = values.map(v => typeof v === 'string' ? { type: v } : v)
      }
    }

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

    // Convert numeric strings to numbers where appropriate
    if (data.caseScore) data.caseScore = parseInt(data.caseScore, 10)
    if (data.incidentDaysSince) data.incidentDaysSince = parseInt(data.incidentDaysSince, 10)
    if (data.injurySeverityIndex) data.injurySeverityIndex = parseInt(data.injurySeverityIndex, 10)

    // Convert checkbox strings to booleans
    data.solFlag = data.solFlag === 'true'
    data.solExpired = data.solExpired === 'true'
    data.inMarket = data.inMarket === 'true'
    data.outOfMarket = data.outOfMarket === 'true'
    data.compNegFlag = data.compNegFlag === 'true'
    data.providerUnknown = data.providerUnknown === 'true'
    data.treatmentOngoing = data.treatmentOngoing === 'true'
    data.awaitingTreatment = data.awaitingTreatment === 'true'
    data.priorAttorney = data.priorAttorney === 'true'
    data.priorSettlement = data.priorSettlement === 'true'
    data.phoneVerified = data.phoneVerified === 'true'
    data.consentGiven = data.consentGiven === 'true'
    data.reportFiled = data.reportFiled === 'true'

    // Submit Lead Data
    const lead = await payload.create({
      collection: 'injured-leads',
      data: data as any,
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