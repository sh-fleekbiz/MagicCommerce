# Magicommerce

Magicommerce is an **AI-native e-commerce platform** built on **shared Azure resources** with advanced artificial intelligence capabilities:

- 🧠 **Azure OpenAI** (`shared-openai-eastus2`) for chat, embeddings, and vision models
- 🔎 **Azure AI Search** (`shared-search-standard-eastus2`) for vector semantic search
- 🗄️ **Azure Database for PostgreSQL** (`pg-shared-apps-eastus2`, DB: `magicommerce`)
- 📦 **Azure Blob Storage** (`stmahumsharedapps`, container: `magicommerce-assets`)

## ✨ AI-Powered Features

### **Core Search & Discovery**
- **🔍 Semantic Search** - Vector-powered product discovery with hybrid text+vector search
- **📸 Visual Search** - Find products using images with AI vision analysis
- **🤖 Intelligent Search** - AI-enhanced query expansion and semantic matching

### **Personalization & Intelligence**
- **💬 Enhanced AI Chat** - Conversational assistant with personalized recommendations
- **🎯 Smart Personalization** - Behavior-driven product suggestions and insights
- **🛍️ Intelligent Recommendations** - Vector similarity and collaborative filtering

### **Business Intelligence**
- **💰 AI Price Optimization** - Competitive analysis and revenue impact simulation
- **✍️ AI Content Generation** - Automated product descriptions and SEO optimization
- **📊 Advanced Analytics** - User behavior tracking and business insights

## 🚀 Key Capabilities

- **Vector Embeddings** - All products indexed with semantic embeddings for advanced search
- **Real-time Personalization** - Dynamic recommendations based on user behavior
- **Multi-modal Search** - Text, image, and semantic search capabilities
- **Business Intelligence** - AI-powered pricing and content optimization tools
- **Scalable Architecture** - Built on Azure's shared infrastructure for enterprise scale

**Demo:** https://magiccommerce.shtrial.com

## Architecture

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma → PostgreSQL (`pg-shared-apps-eastus2`, DB `magicommerce`)
- **AI Stack:** 
  - Azure OpenAI (GPT-5.1-mini, text-embedding-3-small, GPT-4o-mini vision)
  - Azure AI Search (vector embeddings, hybrid search)
- **Personalization:** Behavior tracking with AI-powered recommendations
- **Storage:** Azure Blob Storage (`stmahumsharedapps`, container: `magicommerce-assets`)
- **Infra:** Azure Container Apps / App Service using Next.js standalone output

### **AI Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    MagicCommerce Frontend                   │
│  (Next.js 15 + Enhanced AI Components)                      │
└─────────────────────┬───────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
🤖 AI Chat         🔍 Semantic Search   🎯 Recommendations
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────────────────┴───────────────────────────────────────┐
│                   Next.js API Routes                       │
│         (Enhanced with AI & Personalization)                │
└─────────────────────┬───────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
🧠 Azure OpenAI    🔎 Azure AI Search   🗄️ PostgreSQL
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────────────────┴───────────────────────────────────────┐
│                   Shared Azure Platform                    │
└──────────────────────────────────────────────────────────────┘
```

This repo **must** use the shared MahumTech platform; do **not** create per-app OpenAI or Postgres resources.

## Getting Started (Local)

### Prerequisites

- Node.js 20+
- pnpm (see `packageManager` in `package.json`)
- Access to the shared Azure resources

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client and run migrations
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 3. Copy env
cp .env.example .env.local
# -> Fill AZURE_OPENAI_*, DATABASE_URL, AZURE_SEARCH_*, AZURE_STORAGE_CONNECTION_STRING

# 4. Initialize AI embeddings (required for semantic search)
curl -X POST http://localhost:3000/api/admin/embeddings \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'

# 5. Run dev
pnpm dev
```

App runs at http://localhost:3000.

## Shared Resources

This repo MUST use existing shared infrastructure:

- `rg-shared-web` for web workloads
- `pg-shared-apps-eastus2` for Postgres (database: `magicommerce`)
- `shared-openai-eastus2` for all LLM work
- `shared-search-standard-eastus2` for vector / hybrid search
- `stmahumsharedapps` for blobs (container: `magicommerce-assets`)

Do **not** create new resource groups, Key Vaults, or duplicate OpenAI resources for this app.

## Deployment

CI/CD is handled via GitHub Actions (`.github/workflows/deploy.yml`):

- Builds a standalone Next.js image
- Pushes to `acrmahumshared`
- Deploys to Azure Container Apps/App Service in `rg-shared-web`

Secrets used by the pipeline (all set via GitHub secrets, **not** Key Vault):

- `AZURE_SUBSCRIPTION_ID`
- `AZURE_TENANT_ID`
- `AZURE_CLIENT_ID`
- `ACR_USERNAME`, `ACR_PASSWORD`
- `DATABASE_URL`
- `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`
- `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_API_KEY`
- Enhanced AI feature flags
- Any app-level secrets matching `.env.example`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/magic-change`)
3. Commit your changes (`git commit -m 'feat: improve magicommerce experience'`)
4. Push to the branch (`git push origin feature/magic-change`)
5. Open a Pull Request

## 📚 Documentation

- **[AI Features Guide](./AI_FEATURES_README.md)** - Comprehensive AI capabilities documentation
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Testing Guide](./TESTING.md)** - E2E testing procedures
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Azure deployment instructions

## 🔧 AI Setup

After deployment, initialize the AI features:

```bash
# Check Azure Search health
GET /api/admin/embeddings

# Initialize product embeddings
POST /api/admin/embeddings
{
  "action": "initialize"
}

# Test price optimization
POST /api/admin/price-optimization
{
  "action": "analyze",
  "productId": 123
}
```

## 📈 AI Metrics

Monitor these key performance indicators:
- **Search Relevance:** Vector search accuracy and click-through rates
- **Personalization:** Recommendation conversion rates
- **AI Engagement:** Chat interaction metrics and satisfaction
- **Business Impact:** Revenue attribution from AI features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
