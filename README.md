# Magicommerce

Magicommerce is an AI-native e-commerce prototype built on **shared Azure resources**:

- 🧠 **Azure OpenAI** (`shared-openai-eastus2`) for chat, semantic search, and visual search
- 🗄️ **Azure Database for PostgreSQL** (`pg-shared-apps-eastus2`, DB: `magicommerce`)
- 🔎 **Azure AI Search** (`shared-search-standard-eastus2`, index: `magicommerce-products`)
- 📦 **Azure Blob Storage** (`stmahumsharedapps`, container: `magicommerce-assets`)

The app demonstrates:

- Vector-powered product discovery (semantic & visual search)
- Stateful AI shopping assistant (Postgres-backed chat)
- Event tracking for personalization

**Demo:** https://magiccommerce.shtrial.com

## Architecture

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v3 (migrating toward v4)
- **ORM:** Prisma → PostgreSQL (`pg-shared-apps-eastus2`, DB `magicommerce`)
- **AI:** Azure OpenAI (GPT-5.1-mini, text-embedding-3-small, GPT-4o-mini vision)
- **Search:** Azure AI Search (`magicommerce-products` index)
- **Storage:** Azure Blob Storage (`stmahumsharedapps`, container `magicommerce-assets`)
- **Infra:** Azure Container Apps / App Service using Next.js standalone output

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

# 4. Run dev
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
- Any app-level secrets matching `.env.example`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/magic-change`)
3. Commit your changes (`git commit -m 'feat: improve magicommerce experience'`)
4. Push to the branch (`git push origin feature/magic-change`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
