# GitHub Data Extraction Skill Specification

This specification defines a comprehensive system prompt, toolset, and execution protocol designed to equip any Large Language Model (LLM) with the capability to autonomously navigate, map, and retrieve content from public GitHub repositories.

---

## 1. System Prompt Module: "GitHub Navigator & Extractor"

Inject the following instruction block into the LLM's system prompt or context window to establish the behavioral baseline, architectural understanding, and constraint boundaries required for reliable repository interaction.

```markdown
# Role: GitHub Data Extraction Engine

You possess the advanced skill to programmatically navigate, map, and extract data from any public GitHub repository using the GitHub REST API v3 and direct raw content delivery systems.

## Core Directives
1. **Coordinate Parsing:** Automatically extract `owner`, `repo`, `path`, and `ref` (branch/commit/tag) from any provided GitHub URL or natural language reference before initiating network calls.
2. **Efficiency First:** Favor targeted file extraction over blind directory dumping. Use repository trees to map layout before reading deep files.
3. **Payload Optimization:** Truncate or chunk files exceeding your context window tokens or 100KB, focusing on critical structures (e.g., imports, class definitions, exported APIs) unless the full file is explicitly demanded.
4. **Rate Limit Awareness:** You operate natively without authentication (60 requests/hour limit) unless a `GITHUB_TOKEN` is explicitly passed in headers. Conserve API calls by utilizing raw endpoints for file content.

## Strategy Selection Matrix
- To understand directory layouts or find files: Use the **Repository Trees API**.
- To read text/code files under 1MB: Use the **Raw Content Delivery Network (CDN)**.
- To read files over 1MB or fetch metadata: Use the **Repository Contents API**.
- To inspect commit history, issues, or PRs: Use specific **REST Endpoints**.

## Error & Edge-Case Handling Protocols
- **403 Forbidden / Rate Limit Exceeded:** Immediately halt sequential requests. Inform the user of the rate limit state and provide the exact remaining time based on the `x-ratelimit-reset` header if available.
- **404 Not Found:** Do not guess paths. Query the parent directory or use the Search API to locate moved or renamed resources.
- **Binary Files (.png, .jar, .pfx):** Do not attempt to render or read raw binary streams. Report the file type, size, and presence to the user without downloading the content body.

```

---

## 2. API & URL Architecture Blueprint

The LLM must map natural language extraction intents to the correct programmatic endpoint. The following matrix governs endpoint generation:

| Objective | Method | Target URL / Endpoint Template | Key Advantages / Constraints |
| --- | --- | --- | --- |
| **Read File Content** | `GET` | `[https://raw.githubusercontent.com/](https://raw.githubusercontent.com/){owner}/{repo}/{ref}/{path}` | Bypasses API rate limits entirely. Ideal for code, markdown, and config files. |
| **Flat Repo Mapping** | `GET` | `[https://api.github.com/repos/](https://api.github.com/repos/){owner}/{repo}/git/trees/{ref}?recursive=1` | Returns the entire repository layout in a single JSON call. Limits depth tracking overhead. |
| **Directory Listing** | `GET` | `[https://api.github.com/repos/](https://api.github.com/repos/){owner}/{repo}/contents/{path}?ref={ref}` | Provides file sizes, types, and cryptographic hashes (SHA) for a localized path. |
| **Search Codebase** | `GET` | `[https://api.github.com/search/code?q=](https://api.github.com/search/code?q=){query}+repo:{owner}/{repo}` | pinpoints specific keywords, annotations, or symbols across the entire repository. |
| **Get Metadata** | `GET` | `[https://api.github.com/repos/](https://api.github.com/repos/){owner}/{repo}` | Returns default branch, star counts, open issues count, and licensing data. |

---

## 3. Standardized JSON Tool Definitions (Function Calling)

If the target LLM supports native function calling (e.g., OpenAI Tools, Ollama, Claude Tool Use), implement the following three primary tool schemas. This abstraction layers the actual HTTP execution into the host environment while the LLM manages logic.

### Tool 1: `github_map_repository_tree`

Generates a complete or partial list of all files and directories within a repository to let the model understand the project structure before choosing what to read.

```json
{
  "name": "github_map_repository_tree",
  "description": "Fetches the layout of a GitHub repository recursively. Use this to discover the file architecture and locate specific files.",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": { "type": "string", "description": "The GitHub organization or user account name." },
      "repo": { "type": "string", "description": "The name of the repository." },
      "ref": { "type": "string", "description": "The branch, commit SHA, or tag to map. Defaults to 'main' or 'master' if omitted.", "default": "main" },
      "recursive": { "type": "boolean", "description": "Set to true to fetch the entire tree recursively, or false for just the root level.", "default": true }
    },
    "required": ["owner", "repo"]
  }
}

```

### Tool 2: `github_fetch_file_content`

Retrieves the raw content of any text file directly.

```json
{
  "name": "github_fetch_file_content",
  "description": "Extracts the raw text content of a specific file from a public GitHub repository using the raw content delivery network.",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": { "type": "string", "description": "The GitHub organization or user account name." },
      "repo": { "type": "string", "description": "The name of the repository." },
      "path": { "type": "string", "description": "The clear path to the file from the repository root (e.g., 'src/API/Controllers/UserController.cs')." },
      "ref": { "type": "string", "description": "The branch, commit SHA, or tag name.", "default": "main" }
    },
    "required": ["owner", "repo", "path"]
  }
}

```

### Tool 3: `github_search_code`

Executes regex-like string matching across the code assets of a single repository.

```json
{
  "name": "github_search_code",
  "description": "Searches for specific code blocks, terms, imports, or variable declarations inside a single GitHub repository.",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": { "type": "string", "description": "The GitHub organization or user account name." },
      "repo": { "type": "string", "description": "The name of the repository." },
      "query": { "type": "string", "description": "The search term or pattern (e.g., 'DBContext', 'MongoClient', 'v1/api')." }
    },
    "required": ["owner", "repo", "query"]
  }
}

```

---

## 4. Execution Protocol & Decision Trees

When an extraction task is requested, the LLM must execute its analysis via a precise mental checklist to avoid unnecessary API consumption and context window flooding.

```
       [User Intent: Fetch Data from GitHub]
                         │
                         ▼
           [Parse URL / Target Repository]
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
 [Specific File Named]         [Unknown Architecture]
         │                               │
         │                               ▼
         │                 [Invoke github_map_repository_tree]
         │                               │
         │                               ▼
         │                 [Analyze Layout & Find Paths]
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
         [Check Extension / Meta-Type]
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
   [Binary File]                  [Text / Code File]
         │                               │
         ▼                               ▼
 [Report Specs Only]          [Invoke github_fetch_file_content]
                                         │
                                         ▼
                             [Check Content Length]
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                  [Within Limits]                [Exceeds Max Tokens]
                         │                               │
                         ▼                               ▼
                 [Stream to Context]             [Parse & Summarize Structs]

```

### Advanced Handling of Large Files (>1MB)

When the Git Trees metadata indicates a target file is exceptionally large (such as a database seed file, lockfile, or massive monolithic class):

1. **Do not** pass the raw string directly into the core conversational context.
2. The model must apply a regex or line-by-line streaming filter to isolate target blocks (e.g., only parsing dependency definitions inside a huge package configuration file).
3. If requested by an agentic environment (such as Roo Code), the model should use native paging or chunking parameters to process the file in sequences of less than 50,000 tokens at a time.

> **Header Strictness Rule:** When executing tools that fallback to the GitHub API instead of the raw user content CDN, the LLM/runner framework must always inject the header `User-Agent: LLM-Data-Extraction-Engine`. This ensures compliance with GitHub's API guidelines and avoids automatic connection drops.

---