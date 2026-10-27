import type { RepoResult } from '../../types/search'
import type { ComparisonQuery, ComparisonResponse } from '../../types/comparison'
import { isRecord, isRepoResult } from '../discover/searchApi'

function isComparisonResponse(value: unknown): value is ComparisonResponse {
  return (
    isRecord(value) &&
    typeof value.comparison_id === 'string' &&
    typeof value.comparison === 'string' &&
    typeof value.created_at === 'string' &&
    value.report_type === 'compare' &&
    Array.isArray(value.selected_repos) &&
    value.selected_repos.every(isRepoResult) &&
    Array.isArray(value.missing_readme) &&
    value.missing_readme.every((item) => typeof item === 'string') &&
    isComparisonReport(value.report)
  )
}

function isComparisonReport(value: unknown): value is ComparisonResponse['report'] {
  return (
    isRecord(value) &&
    typeof value.overview === 'string' &&
    typeof value.recommendation === 'string' &&
    Array.isArray(value.repositories) &&
    value.repositories.every(
      (repository) =>
        isRecord(repository) &&
        typeof repository.full_name === 'string' &&
        typeof repository.summary === 'string' &&
        ['key_features', 'tech_stack', 'use_cases', 'strengths', 'limitations'].every(
          (field) => Array.isArray(repository[field]) && repository[field].every((item) => typeof item === 'string'),
        ),
    ) &&
    Array.isArray(value.comparison) &&
    value.comparison.every(
      (section) =>
        isRecord(section) &&
        typeof section.criterion === 'string' &&
        typeof section.best_fit === 'string' &&
        Array.isArray(section.assessments) &&
        section.assessments.every(
          (assessment) =>
            isRecord(assessment) &&
            typeof assessment.full_name === 'string' &&
            typeof assessment.assessment === 'string',
        ),
    )
  )
}

export function createComparisonQuery(criteria: string, repositories: RepoResult[]): string {
  const repositoryList = repositories
    .map((repository) => `- ${repository.full_name} (ID: ${repository.repo_id}) at ${repository.html_url}`)
    .join('\n')
  return `Compare the following repositories based on these criteria: ${criteria}\n\nRepositories:\n${repositoryList}`
}

function createMockComparison(): ComparisonResponse {
  return {
    "comparison_id": "5717fc1a-e562-4f6e-aa24-e27301cf3331",
    "comparison": "## Overview\n\nThe two repositories serve distinctly different purposes: metafloor/bwip-js is a comprehensive JavaScript library for generating over 100 types of barcodes on various platforms, whereas craftzdog/react-native-animated-todo is an example ToDo app built with React Native showcasing smooth animations and UI components. metafloor/bwip-js focuses on barcode generation with broad platform support, while react-native-animated-todo emphasizes React Native app animation and UI design.\n\n### metafloor/bwip-js\n\nbwip-js is a JavaScript library that ports Barcode Writer in Pure PostScript into native JavaScript, enabling barcode generation across browsers, Node.js, React, React Native, and more.\n\n**Key features**\n\n- Supports over 100 barcode types and standards\n- Generates barcodes as PNG, SVG, or canvas images\n- Works on browsers, Node.js, React Native, Electron, and command line\n- Platform-specific packages for optimized usage\n- Extensive options for scaling, rotation, padding, and encoding\n- Online barcode generator and API available\n\n**Tech stack:** JavaScript, Node.js, React, React Native, SVG, Canvas API\n\n**Use cases**\n\n- Generating a wide variety of barcode images on web or server\n- Embedding barcodes in web or mobile apps\n- Using barcode generation in cross-platform JS environments\n- Creating barcodes dynamically on demand via API\n\n**Strengths**\n\n- Very broad barcode type support (100+)\n- Cross-platform, supports multiple output targets (PNG, SVG, Canvas)\n- Mature project with recent updates and detailed documentation\n- Has online API and demo app for easy testing\n- Flexible options for barcode customization\n\n**Limitations**\n\n- No information about ease of integration or learning curve\n- No explicit mention of performance benchmarks\n- API usage details partially summarized, some advanced configuration require BWIPP knowledge\n\n### craftzdog/react-native-animated-todo\n\nA smoothly animated ToDo app built with React Native that demonstrates advanced animations using Reanimated v2 and includes themable UI components with NativeBase.\n\n**Key features**\n\n- Animated checkbox component published as separate NPM package\n- Uses Expo for building and delivering React Native apps\n- Utilizes React Navigation for routing\n- Incorporates React Native Reanimated and Moti for animations\n- Uses React Native SVG for vector graphics\n- Clean project structure separating screens, components, utils, and assets\n\n**Tech stack:** React Native, Expo, React Navigation v6, NativeBase, React Native Reanimated v2, React Native SVG, Moti\n\n**Use cases**\n\n- Developers learning advanced React Native animations\n- Building animated UI with React Native and themable components\n- Example app for React Native Reanimated usage\n- Starting point for todo apps with good animation and structure\n\n**Strengths**\n\n- Clear project structure and tooling\n- Utilizes modern React Native animation libraries\n- Published reusable animated checkbox component\n- Includes themeable UI elements\n- Has tutorial video and demo\n- Easy to run with Expo client\n\n**Limitations**\n\n- Limited scope as example ToDo app, not a library\n- Does not include backend or persistence details\n- Focuses mainly on animations, limited feature set for real-world apps\n- No mention of iOS/Android specific support or limitations\n\n## Comparison\n\n### Platform Support\n\n- **metafloor/bwip-js:** Supports browser, Node.js, React Native, Electron, command line, and more, offering broad platform compatibility.\n- **craftzdog/react-native-animated-todo:** Built specifically for React Native applications, focused mainly on mobile platforms and Expo.\n\nBest fit: **metafloor/bwip-js**\n\n### Purpose and Use Cases\n\n- **metafloor/bwip-js:** Designed for barcode generation supporting many standards and output formats for diverse applications.\n- **craftzdog/react-native-animated-todo:** A ToDo app demo project showcasing React Native animations and UI components.\n\nBest fit: **metafloor/bwip-js**\n\n### Tech Stack and Extensibility\n\n- **metafloor/bwip-js:** JavaScript library usable in various JS environments with multiple output formats; extensible with barcode options and API.\n- **craftzdog/react-native-animated-todo:** Uses modern React Native stack with animation libraries and themable UI; extensible for mobile app development.\n\nBest fit: **Tie**\n\n### Documentation and Community Support\n\n- **metafloor/bwip-js:** Detailed README, extensive barcode list, method references, online demos, and API, stars: 2424.\n- **craftzdog/react-native-animated-todo:** Includes README with tutorial links, NPM package for a component, YouTube videos, stars: 460.\n\nBest fit: **metafloor/bwip-js**\n\n## Recommendation\n\nChoose metafloor/bwip-js if you need a comprehensive and versatile barcode generation library that works across many platforms, or if you require numerous barcode types and formats. It is suitable for developers needing barcode generation in web or server environments. Choose craftzdog/react-native-animated-todo if you are learning or building a React Native app focusing on smooth animations and UI components, especially as a demo or starting point for animated mobile apps. It is best suited for React Native developers interested in UI animation techniques and Expo workflows.",
    "selected_repos": [
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
      }
    ],
    "missing_readme": [],
    "report": {
      "overview": "The two repositories serve distinctly different purposes: metafloor/bwip-js is a comprehensive JavaScript library for generating over 100 types of barcodes on various platforms, whereas craftzdog/react-native-animated-todo is an example ToDo app built with React Native showcasing smooth animations and UI components. metafloor/bwip-js focuses on barcode generation with broad platform support, while react-native-animated-todo emphasizes React Native app animation and UI design.",
      "repositories": [
        {
          "full_name": "metafloor/bwip-js",
          "summary": "bwip-js is a JavaScript library that ports Barcode Writer in Pure PostScript into native JavaScript, enabling barcode generation across browsers, Node.js, React, React Native, and more.",
          "key_features": [
            "Supports over 100 barcode types and standards",
            "Generates barcodes as PNG, SVG, or canvas images",
            "Works on browsers, Node.js, React Native, Electron, and command line",
            "Platform-specific packages for optimized usage",
            "Extensive options for scaling, rotation, padding, and encoding",
            "Online barcode generator and API available"
          ],
          "tech_stack": [
            "JavaScript",
            "Node.js",
            "React",
            "React Native",
            "SVG",
            "Canvas API"
          ],
          "use_cases": [
            "Generating a wide variety of barcode images on web or server",
            "Embedding barcodes in web or mobile apps",
            "Using barcode generation in cross-platform JS environments",
            "Creating barcodes dynamically on demand via API"
          ],
          "strengths": [
            "Very broad barcode type support (100+)",
            "Cross-platform, supports multiple output targets (PNG, SVG, Canvas)",
            "Mature project with recent updates and detailed documentation",
            "Has online API and demo app for easy testing",
            "Flexible options for barcode customization"
          ],
          "limitations": [
            "No information about ease of integration or learning curve",
            "No explicit mention of performance benchmarks",
            "API usage details partially summarized, some advanced configuration require BWIPP knowledge"
          ]
        },
        {
          "full_name": "craftzdog/react-native-animated-todo",
          "summary": "A smoothly animated ToDo app built with React Native that demonstrates advanced animations using Reanimated v2 and includes themable UI components with NativeBase.",
          "key_features": [
            "Animated checkbox component published as separate NPM package",
            "Uses Expo for building and delivering React Native apps",
            "Utilizes React Navigation for routing",
            "Incorporates React Native Reanimated and Moti for animations",
            "Uses React Native SVG for vector graphics",
            "Clean project structure separating screens, components, utils, and assets"
          ],
          "tech_stack": [
            "React Native",
            "Expo",
            "React Navigation v6",
            "NativeBase",
            "React Native Reanimated v2",
            "React Native SVG",
            "Moti"
          ],
          "use_cases": [
            "Developers learning advanced React Native animations",
            "Building animated UI with React Native and themable components",
            "Example app for React Native Reanimated usage",
            "Starting point for todo apps with good animation and structure"
          ],
          "strengths": [
            "Clear project structure and tooling",
            "Utilizes modern React Native animation libraries",
            "Published reusable animated checkbox component",
            "Includes themeable UI elements",
            "Has tutorial video and demo",
            "Easy to run with Expo client"
          ],
          "limitations": [
            "Limited scope as example ToDo app, not a library",
            "Does not include backend or persistence details",
            "Focuses mainly on animations, limited feature set for real-world apps",
            "No mention of iOS/Android specific support or limitations"
          ]
        }
      ],
      "comparison": [
        {
          "criterion": "Platform Support",
          "assessments": [
            {
              "full_name": "metafloor/bwip-js",
              "assessment": "Supports browser, Node.js, React Native, Electron, command line, and more, offering broad platform compatibility."
            },
            {
              "full_name": "craftzdog/react-native-animated-todo",
              "assessment": "Built specifically for React Native applications, focused mainly on mobile platforms and Expo."
            }
          ],
          "best_fit": "metafloor/bwip-js"
        },
        {
          "criterion": "Purpose and Use Cases",
          "assessments": [
            {
              "full_name": "metafloor/bwip-js",
              "assessment": "Designed for barcode generation supporting many standards and output formats for diverse applications."
            },
            {
              "full_name": "craftzdog/react-native-animated-todo",
              "assessment": "A ToDo app demo project showcasing React Native animations and UI components."
            }
          ],
          "best_fit": "metafloor/bwip-js"
        },
        {
          "criterion": "Tech Stack and Extensibility",
          "assessments": [
            {
              "full_name": "metafloor/bwip-js",
              "assessment": "JavaScript library usable in various JS environments with multiple output formats; extensible with barcode options and API."
            },
            {
              "full_name": "craftzdog/react-native-animated-todo",
              "assessment": "Uses modern React Native stack with animation libraries and themable UI; extensible for mobile app development."
            }
          ],
          "best_fit": "Tie"
        },
        {
          "criterion": "Documentation and Community Support",
          "assessments": [
            {
              "full_name": "metafloor/bwip-js",
              "assessment": "Detailed README, extensive barcode list, method references, online demos, and API, stars: 2424."
            },
            {
              "full_name": "craftzdog/react-native-animated-todo",
              "assessment": "Includes README with tutorial links, NPM package for a component, YouTube videos, stars: 460."
            }
          ],
          "best_fit": "metafloor/bwip-js"
        }
      ],
      "recommendation": "Choose metafloor/bwip-js if you need a comprehensive and versatile barcode generation library that works across many platforms, or if you require numerous barcode types and formats. It is suitable for developers needing barcode generation in web or server environments. Choose craftzdog/react-native-animated-todo if you are learning or building a React Native app focusing on smooth animations and UI components, especially as a demo or starting point for animated mobile apps. It is best suited for React Native developers interested in UI animation techniques and Expo workflows."
    },
    "report_type": "compare",
    "created_at": "2026-10-27T04:46:56.445711Z"
  }
}

export async function compareRepositories(
  criteria: string,
  repositories: [RepoResult, ...RepoResult[]],
  accessToken: string | undefined,
): Promise<ComparisonResponse> {
  if (import.meta.env.VITE_USE_MOCK_COMPARE === 'true') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return createMockComparison()
  }

  if (!accessToken) throw new Error('Please sign in to compare repositories.')

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const request: ComparisonQuery = { query: createComparisonQuery(criteria, repositories), repositories }
  const response = await fetch(`${apiUrl}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Comparison request failed (${response.status}).`)

  const data: unknown = await response.json()
  if (!isComparisonResponse(data)) throw new Error('The comparison API returned an invalid response.')
  return data
}
