import type { RepoResult, SearchQuery, SearchResponse } from '../../types/search'

const mockRepositories: RepoResult[] = [
        {
            "repo_id": "340402576",
            "name": "react-native-vision-camera",
            "full_name": "margelo/react-native-vision-camera",
            "description": "📸 A powerful, high-performance React Native Camera library.",
            "html_url": "https://github.com/margelo/react-native-vision-camera",
            "stargazers_count": 9646
        },
        {
            "repo_id": "52881637",
            "name": "react-native-actionsheet",
            "full_name": "beefe/react-native-actionsheet",
            "description": "An elegant ActionSheet component for React Native.",
            "html_url": "https://github.com/beefe/react-native-actionsheet",
            "stargazers_count": 1355
        },
        {
            "repo_id": "99263293",
            "name": "react-native-sketch-canvas",
            "full_name": "terrylinla/react-native-sketch-canvas",
            "description": "A React Native component for drawing by touching on both iOS and Android.",
            "html_url": "https://github.com/terrylinla/react-native-sketch-canvas",
            "stargazers_count": 716
        },
        {
            "repo_id": "39454666",
            "name": "awesome-dataviz",
            "full_name": "hal9ai/awesome-dataviz",
            "description": "A curated list of awesome data visualization libraries and resources.",
            "html_url": "https://github.com/hal9ai/awesome-dataviz",
            "stargazers_count": 4434
        },
        {
            "repo_id": "144546080",
            "name": "react-native-signature-canvas",
            "full_name": "YanYuanFE/react-native-signature-canvas",
            "description": ":black_nib: React Native Signature Component based  WebView Canvas for Android && IOS && expo",
            "html_url": "https://github.com/YanYuanFE/react-native-signature-canvas",
            "stargazers_count": 507
        },
        {
            "repo_id": "32302012",
            "name": "bwip-js",
            "full_name": "metafloor/bwip-js",
            "description": "Barcode Writer in Pure JavaScript",
            "html_url": "https://github.com/metafloor/bwip-js",
            "stargazers_count": 2424
        },
        {
            "repo_id": "426456412",
            "name": "react-native-animated-todo",
            "full_name": "craftzdog/react-native-animated-todo",
            "description": "Animated ToDo app built with React Native and Reanimated v2",
            "html_url": "https://github.com/craftzdog/react-native-animated-todo",
            "stargazers_count": 460
        },
        {
            "repo_id": "486967534",
            "name": "react-native-graph",
            "full_name": "margelo/react-native-graph",
            "description": "📈 Beautiful, high-performance Graphs and Charts for React Native built with Skia",
            "html_url": "https://github.com/margelo/react-native-graph",
            "stargazers_count": 2634
        },
        {
            "repo_id": "106032326",
            "name": "react-native-copilot",
            "full_name": "mohebifar/react-native-copilot",
            "description": "Step-by-step walkthrough tooltip for your react native app",
            "html_url": "https://github.com/mohebifar/react-native-copilot",
            "stargazers_count": 2435
        },
        {
            "repo_id": "94603643",
            "name": "react-native-examples",
            "full_name": "ethantran/react-native-examples",
            "description": "UI examples from pttrns.com converted to React Native.  Examples of SVG Animation with react-native-svg, flubber, d3",
            "html_url": "https://github.com/ethantran/react-native-examples",
            "stargazers_count": 320
        }
    ]

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isRepoResult(value: unknown): value is RepoResult {
  return (
    isRecord(value) &&
    typeof value.repo_id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.full_name === 'string' &&
    (typeof value.description === 'string' || value.description === null) &&
    typeof value.html_url === 'string' &&
    typeof value.stargazers_count === 'number'
  )
}

function isSearchResponse(value: unknown): value is SearchResponse {
  return (
    isRecord(value) &&
    typeof value.search_id === 'string' &&
    typeof value.search_query === 'string' &&
    typeof value.analyzed_query === 'string' &&
    typeof value.text_response === 'string' &&
    (value.search_results === null ||
      (Array.isArray(value.search_results) && value.search_results.every(isRepoResult))) &&
    typeof value.created_at === 'string'
  )
}

function createMockResponse(query: string): SearchResponse {
  return {
    search_id: `mock-${Date.now()}`,
    search_query: query,
    analyzed_query: query,
    text_response: `Here are a few popular repositories to start exploring for "${query}".`,
    search_results: mockRepositories.map((repository) => ({ ...repository })),
    created_at: new Date().toISOString(),
  }
}

export async function searchRepositories(query: string): Promise<SearchResponse> {
  if (import.meta.env.VITE_USE_MOCK_SEARCH === 'true') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return createMockResponse(query)
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const request: SearchQuery = { query, limit: 10 }
  const response = await fetch(`${apiUrl}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Search request failed (${response.status}).`)

  const data: unknown = await response.json()
  if (!isSearchResponse(data)) throw new Error('The search API returned an invalid response.')
  return data
}