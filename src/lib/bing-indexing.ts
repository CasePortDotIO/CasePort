/**
 * Bing IndexNow Integration
 * Submits URLs to Bing for fast crawling using the IndexNow protocol
 * Docs: https://www.bing.com/indexnow
 */

interface IndexNowPayload {
  host: string
  key: string
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
 * @param urls - Array of URLs to submit
 * @param siteUrl - The site URL (e.g., https://www.caseport.io)
 * @returns Result of the indexing request
 */
export async function submitToBingIndexNow(
  urls: string[],
  siteUrl: string = 'https://www.caseport.io'
): Promise<IndexingResult> {
  const bingApiKey = process.env.BING_INDEXNOW_API_KEY

  if (!bingApiKey) {
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
    // Extract host from siteUrl
    const urlObj = new URL(siteUrl)
    const host = urlObj.hostname

    // IndexNow endpoint - Bing accepts submissions at this endpoint
    const endpoint = 'https://www.bing.com/indexnow'

    const payload: IndexNowPayload = {
      host,
      key: bingApiKey,
      urlList: urls,
    }

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
        message: `Successfully submitted ${urls.length} URL(s) to Bing IndexNow`,
        submittedUrls: urls,
      }
    }

    // Bing returns 200 even for errors sometimes, check response body
    const responseText = await response.text()

    // If Bing doesn't recognize the key yet, it still accepts but logs warning
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: `Submitted ${urls.length} URL(s) to Bing. Note: Ensure site is verified in Bing Webmaster Tools.`,
        submittedUrls: urls,
      }
    }

    return {
      success: false,
      message: `Bing IndexNow returned status ${response.status}`,
      error: responseText || `HTTP ${response.status}`,
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
  // Bing API keys are typically 32 characters, alphanumeric
  return key.length >= 32 && /^[a-zA-Z0-9-]+$/.test(key)
}