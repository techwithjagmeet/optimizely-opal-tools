# Optimizely Opal Tools

A serverless tools service built with the Optimizely Opal Tools SDK, providing extensible tools that can be integrated with Opal AI agents. This project demonstrates how to create and deploy custom tools using TypeScript and Express.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Available Tools](#available-tools)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Development](#development)

## 🎯 Overview

This project is a tools service that exposes custom tools via HTTP endpoints. These tools can be discovered and invoked by Optimizely Opal AI agents. The service is built using:

- **TypeScript** - Type-safe development
- **Express.js** - Web framework
- **@optimizely-opal/opal-tools-sdk** - SDK for creating Opal-compatible tools
- **Vercel** - Serverless deployment platform

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    Opal AI Agent                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Discovery Request: GET /discovery                 │    │
│  │  Tool Invocation: POST /tools/{tool-name}           │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP Requests
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Opal Tools Service                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Server (Port 3000)                          │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  ToolsService (from SDK)                        │  │   │
│  │  │  - Registers tools                              │  │   │
│  │  │  - Exposes /discovery endpoint                  │  │   │
│  │  │  - Handles /tools/{tool-name} endpoints        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Tool: get_news                                 │  │   │
│  │  │  - Fetches news from NewsAPI                    │  │   │
│  │  │  - Filters and transforms results              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ API Calls
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              External APIs                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NewsAPI (newsapi.org)                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **ToolsService**: Core SDK component that manages tool registration and HTTP routing
2. **Tool Decorators**: `@tool` decorator used to define tools with metadata
3. **Express App**: HTTP server that hosts the tools service
4. **Tool Implementations**: Individual tool functions (e.g., `getNews`)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **NewsAPI Key** - Get a free API key from [newsapi.org](https://newsapi.org/)

## 🚀 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:

   ```bash
   cd optimizely-opal-tools
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:

   ```bash
   cp .env.example .env  # If you have an example file
   # Or create manually
   ```

4. **Configure environment variables** (see [Configuration](#configuration) section)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# NewsAPI Configuration
NEWS_API_KEY=your_newsapi_key_here

# Server Configuration (optional)
PORT=3000
```

### Getting a NewsAPI Key

1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to your `.env` file

**Note**: The free tier has rate limits. For production use, consider upgrading your NewsAPI plan.

## 🏃 Running the Project

### Development Mode

Run the service in development mode with hot-reloading:

```bash
npm run dev
```

The service will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

### Production Mode

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Start the server**:

   ```bash
   npm start
   ```

### Verify Installation

Once the server is running, you should see:

```text
Opal Tools Service listening on port 3000
Discovery endpoint: http://localhost:3000/discovery
Try calling the tool: POST http://localhost:3000/tools/get-news with JSON body: { "query": "technology" }
```

## 🔌 API Endpoints

### Discovery Endpoint

**GET** `/discovery`

Returns a list of all available tools and their metadata.

**Response Example**:

```json
{
  "tools": [
    {
      "name": "get_news",
      "description": "Fetch latest news articles based on a search query and optional filters.",
      "parameters": [
        {
          "name": "query",
          "type": "string",
          "required": true,
          "description": "Search query, e.g., 'technology'"
        },
        {
          "name": "language",
          "type": "string",
          "required": false,
          "description": "Language code (default: en)"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": false,
          "description": "Number of articles per page (default: 5)"
        },
        {
          "name": "page",
          "type": "number",
          "required": false,
          "description": "Page number (default: 1)"
        },
        {
          "name": "sortBy",
          "type": "string",
          "required": false,
          "description": "Sort by relevancy, popularity, or publishedAt (default: publishedAt)"
        }
      ]
    }
  ]
}
```

### Tool Invocation Endpoint

**POST** `/tools/{tool-name}`

Invokes a specific tool with the provided parameters.

**Example Request**:

```bash
curl -X POST http://localhost:3000/tools/get-news \
  -H "Content-Type: application/json" \
  -d '{
    "query": "technology",
    "language": "en",
    "pageSize": 5,
    "page": 1,
    "sortBy": "publishedAt"
  }'
```

**Example Response**:

```json
[
  {
    "title": "Latest Technology News",
    "description": "Description of the article...",
    "url": "https://example.com/article",
    "source": "Tech News",
    "publishedAt": "2024-01-15T10:00:00Z"
  }
]
```

## 🛠️ Available Tools

### get_news

Fetches the latest news articles from NewsAPI based on search criteria.

**Parameters**:

- `query` (string, required): Search query, e.g., "technology"
- `language` (string, optional): Language code (default: "en")
- `pageSize` (number, optional): Number of articles per page (default: 5)
- `page` (number, optional): Page number (default: 1)
- `sortBy` (string, optional): Sort order - "relevancy", "popularity", or "publishedAt" (default: "publishedAt")

**Returns**: Array of news articles with:

- `title`: Article title
- `description`: Article description
- `url`: Article URL
- `source`: News source name
- `publishedAt`: Publication timestamp

## 📁 Project Structure

```text
optimizely-opal-tools/
├── api/
│   ├── index.ts          # Main Express server and tool registration
│   └── get-news.ts       # News API tool implementation
├── dist/                 # Compiled JavaScript (generated)
├── node_modules/         # Dependencies
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore rules
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## 🚢 Deployment

### Deploying to Vercel

This project is configured for Vercel serverless deployment:

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables**:

   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `NEWS_API_KEY` with your API key value

4. **Redeploy** after adding environment variables

The `vercel.json` configuration automatically:

- Builds the TypeScript files using `@vercel/node`
- Routes all requests to `api/index.ts`
- Handles serverless function deployment

### Alternative Deployment Options

You can also deploy to:

- **AWS Lambda** (with appropriate adapter)
- **Google Cloud Functions**
- **Azure Functions**
- **Any Node.js hosting** (using `npm start` after build)

## 💻 Development

### Adding a New Tool

1. **Create a new tool file** in the `api/` directory:

   ```typescript
   // api/my-tool.ts
   import axios from "axios";
   
   export type MyToolParams = {
     param1: string;
     param2?: number;
   };
   
   export async function myTool(params: MyToolParams) {
     // Tool implementation
     return result;
   }
   ```

2. **Register the tool** in `api/index.ts`:

   ```typescript
   import { myTool, type MyToolParams } from "./my-tool.js";
   
   tool({
     name: "my_tool",
     description: "Description of what the tool does",
     parameters: [
       { name: "param1", type: ParameterType.String, required: true, description: "..." },
       { name: "param2", type: ParameterType.Number, required: false, description: "..." },
     ],
   })(async (params: MyToolParams) => {
     return await myTool(params);
   });
   ```

3. **Restart the development server** to see your new tool in the discovery endpoint

### TypeScript Configuration

The project uses strict TypeScript settings:

- ES modules (`"type": "module"`)
- ESNext target and module
- Strict type checking enabled
- Decorator support for the `@tool` decorator

### Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm test` - Run tests (placeholder)

## 🔒 Security Considerations

- **API Keys**: Never commit `.env` files or API keys to version control
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Input Validation**: Validate and sanitize all tool inputs
- **Error Handling**: Implement proper error handling to avoid exposing sensitive information

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues related to:

- **Opal Tools SDK**: Contact Optimizely Opal support
- **This project**: Open an issue in the repository
- **NewsAPI**: Visit [newsapi.org/docs](https://newsapi.org/docs)

---

**Built with ❤️ using Optimizely Opal Tools SDK**
