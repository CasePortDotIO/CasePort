import type { Payload } from 'payload'

/**
 * Store an uploaded claimant file (an insurance card photo, a voice recording, a
 * document) into the Media collection and return a fetchable URL for it. That URL
 * is what the domain layer treats as the media key: the Vision and transcription
 * clients fetch the bytes from it, and the intake event log stores the key, never
 * the image itself (Section 5, W5). Media lives behind the storage adapter, never
 * inlined into an event.
 *
 * Kept deliberately small and defensive: a claimant upload is untrusted input, so
 * the caller bounds the size and the mime type before this is reached.
 */
export async function storeClaimantMedia(
  payload: Payload,
  input: { file: File; alt: string },
): Promise<{ key: string; id: string }> {
  const arrayBuffer = await input.file.arrayBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt: input.alt },
    file: {
      data: Buffer.from(arrayBuffer),
      mimetype: input.file.type || 'application/octet-stream',
      name: input.file.name || 'upload',
      size: input.file.size,
    },
  })
  // The Vercel Blob adapter returns an absolute URL; a local dev store returns a
  // relative path. Prefer the absolute URL when present so the Vision and
  // transcription clients can fetch it directly.
  const url = (doc as { url?: string | null }).url || ''
  return { key: url, id: String((doc as { id: string | number }).id) }
}

/** Read a single File from a multipart form body under the given field name. */
export function fileFromForm(form: FormData, field: string): File | null {
  const value = form.get(field)
  return value instanceof File && value.size > 0 ? value : null
}

/** The largest claimant upload we accept per file. Card photos and short voice
 * clips are small; this blunts a memory bomb without rejecting a real recording. */
export const MAX_MEDIA_BYTES = 25 * 1024 * 1024
