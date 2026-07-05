import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { inngestFunctions } from '@/inngest/functions'

/**
 * The Inngest serve endpoint. Inngest calls back into this route to execute each
 * function step by step, with durable retries. In production the signing key
 * secures it; in dev the Inngest dev server discovers it here.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
})
