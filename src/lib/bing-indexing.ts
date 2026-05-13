/**
 * Bing IndexNow Integration
 * Submits URLs to Bing for fast crawling using the IndexNow protocol
 * Docs: https://www.indexnow.org/
 */

interface IndexNowPayload {
  host: string
  key: string
  keyLocation?: string
  urlList: string[]
}

interface IndexingResult {
  success: boolean
  message: string
  submittedUrls?: string[]
  error?: string
}

/**
 * Submit URLs to Bing IndexNow
 * Uses keyLocation to specify where the key file is hosted
 */
export async function submitToBingIndexNow(
  urls: string[],
  siteUrl: string = 'https://www.caseport.io'
): Promise<IndexingResult> {
  const apiKey = process.env.BING_INDEXNOW_API_KEY

  if (!apiKey) {
    return {
      success: false,
      message: 'BING_INDEXNOW_API_KEY environment variable not configured',
      error: 'Missing API key',
    }
  }

  if (urls.length === 0) {
    return {
      success: false,
      message: 'No URLs provided for indexing',
      error: 'Empty URL list',
    }
  }

  try {
    const urlObj = new URL(siteUrl)
    const host = urlObj.hostname

    // keyLocation tells Bing where to find the key file
    // We host it at the root: https://www.caseport.io/{key}.txt
    const keyLocation = `${siteUrl}/${apiKey}.txt`

    // IndexNow endpoints (try Bing first, then fallback)
    const endpoints = [
      'https://www.bing.com/indexnow',
      'https://api.indexnow.org/indexnow',
    ]

    const payload: IndexNowPayload = {
      host,
      key: apiKey,
      keyLocation,
      urlList: urls,
    }

    let lastError = ''
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          return {
            success: true,
            message: `Successfully submitted ${urls.length} URL(s) to Bing via IndexNow`,
            submittedUrls: urls,
          }
        }

        const errorText = await response.text()
        lastError = `Status ${response.status}: ${errorText}`
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return {
      success: false,
      message: `Failed to submit to IndexNow: ${lastError}`,
      error: lastError,
      submittedUrls: urls,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: 'Failed to submit to Bing IndexNow',
      error: errorMessage,
      submittedUrls: urls,
    }
  }
}

/**
 * Submit a single URL to Bing IndexNow (convenience function)
 */
export async function submitUrlToBing(
  url: string,
  siteUrl: string = 'https://www.caseport.io'
): Promise<IndexingResult> {
  return submitToBingIndexNow([url], siteUrl)
}

/**
 * Validate that the Bing API key format is correct
 */
export function isValidBingApiKey(key: string | undefined): boolean {
  if (!key) return false
  // IndexNow keys are typically 32+ characters, alphanumeric with dashes
  return key.length >= 32 && /^[a-zA-Z0-9-]+$/.test(key)
}
