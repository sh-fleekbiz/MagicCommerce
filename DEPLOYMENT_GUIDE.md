# Deployment Guide for AI Features

This guide walks through deploying Magicommerce with AI features to Azure Container Apps **using the shared MahumTech Azure resources**.

## Prerequisites

1. Azure subscription with:
   - Access to the **shared** Azure OpenAI resource `shared-openai-eastus2` in `rg-shared-ai`
   - Azure Container Apps environment in `rg-shared-web`
   - Azure Container Registry `acrmahumshared`

2. GitHub repository secrets configured:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_KEY`

## Step 1: Configure Azure OpenAI (Shared Resource)

Magicommerce **does not create its own Azure OpenAI resource**. It reuses:

- Resource group: `rg-shared-ai`
- Resource name: `shared-openai-eastus2`

From the Azure Portal, obtain the endpoint and API key for `shared-openai-eastus2` and store them as GitHub secrets and/or app configuration values (see Step 2). Do not create a new OpenAI resource for this app.

### Deploy Chat Model

```bash
# Deploy GPT-4 or GPT-3.5-turbo
az cognitiveservices account deployment create \
  --name openai-magiccommerce \
  --resource-group rg-magiccommerce \
  --deployment-name gpt-5.1 \
  --model-name gpt-4 \
  --model-version "2024-02-01" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name "Standard"
```

## Step 2: Configure GitHub Secrets

Add these secrets to your GitHub repository (or Azure App Config) instead of using Key Vault for this app:

1. Go to: Settings > Secrets and variables > Actions
2. Add the following secrets:

```
AZURE_OPENAI_ENDPOINT=https://your-instance.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_KEY=your-api-key-here
```

## Step 3: Update GitHub Actions Workflow

Ensure your `.github/workflows/deploy.yml` includes environment variables:

```yaml
env:
  # Existing environment variables
  ...
  
  # AI Configuration
  AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
  AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
  AZURE_OPENAI_KEY: ${{ secrets.AZURE_OPENAI_KEY }}
  AZURE_OPENAI_CHAT_DEPLOYMENT: gpt-5.1
  AZURE_OPENAI_CHAT_API_VERSION: 2025-01-01-preview
  
  # Feature Flags (set to true to enable)
  NEXT_PUBLIC_FEATURE_AI_CHAT: true
  NEXT_PUBLIC_FEATURE_AI_SEARCH: true
  NEXT_PUBLIC_FEATURE_AI_PRODUCT_QNA: true
```

## Step 4: Configure Azure Container Apps

### Add Environment Variables

```bash
# Update container app with AI configuration
az containerapp update \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --set-env-vars \
    "AZURE_OPENAI_ENDPOINT=https://your-instance.openai.azure.com/" \
    "AZURE_OPENAI_KEY=your-api-key" \
    "AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-5.1" \
    "AZURE_OPENAI_CHAT_API_VERSION=2025-01-01-preview" \
    "NEXT_PUBLIC_FEATURE_AI_CHAT=true" \
    "NEXT_PUBLIC_FEATURE_AI_SEARCH=true" \
    "NEXT_PUBLIC_FEATURE_AI_PRODUCT_QNA=true"
```

Or use the Azure Portal:
1. Navigate to your Container App
2. Go to Settings > Environment variables
3. Add the variables listed above
4. Click "Save"

## Step 5: Deploy Application

### Option A: Via GitHub Actions

1. Push changes to your repository
2. GitHub Actions will automatically build and deploy
3. Monitor the workflow run in Actions tab

### Option B: Manual Deployment

```bash
# Build Docker image
docker build -t magiccommerce:latest .

# Tag for registry
docker tag magiccommerce:latest yourregistry.azurecr.io/magiccommerce:latest

# Push to registry
docker push yourregistry.azurecr.io/magiccommerce:latest

# Deploy to Container Apps
az containerapp update \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --image yourregistry.azurecr.io/magiccommerce:latest
```

## Step 6: Verify Deployment

### Check Application Logs

```bash
# Stream logs
az containerapp logs show \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --follow

# Look for:
# - [AzureOpenAI] Missing configuration warnings (should NOT appear)
# - Successful API responses
# - Any error messages
```

### Test AI Features

1. **Homepage:**
   - Visit homepage
   - Verify AI Chat widget appears in bottom-right corner
   - Click and send a test message

2. **Search:**
   - Enter a search query
   - Verify results are relevant
   - Check browser console for any errors

3. **Product Page:**
   - Navigate to a product detail page
   - Verify "Ask AI about this product" section appears
   - Ask a test question

4. **Recommendations:**
   - On product page, scroll to "Similar sponsored items"
   - Verify products are displayed
   - Check if they're contextually relevant

## Step 7: Monitoring

### Set Up Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app magiccommerce-insights \
  --location eastus2 \
  --resource-group rg-magiccommerce \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app magiccommerce-insights \
  --resource-group rg-magiccommerce \
  --query "instrumentationKey" -o tsv

# Add to Container App
az containerapp update \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --set-env-vars \
    "APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=your-key"
```

### Monitor Azure OpenAI Usage

1. Go to Azure Portal
2. Navigate to your Azure OpenAI resource
3. Go to Monitoring > Metrics
4. Monitor:
   - Total Calls
   - Token Usage
   - Error Rate
   - Latency

## Rollback Plan

If AI features cause issues:

### Option 1: Disable Feature Flags

```bash
# Disable all AI features
az containerapp update \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --set-env-vars \
    "NEXT_PUBLIC_FEATURE_AI_CHAT=false" \
    "NEXT_PUBLIC_FEATURE_AI_SEARCH=false" \
    "NEXT_PUBLIC_FEATURE_AI_PRODUCT_QNA=false"
```

### Option 2: Rollback to Previous Version

```bash
# List revisions
az containerapp revision list \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --query "[].{Name:name, Active:properties.active, Created:properties.createdTime}" -o table

# Activate previous revision
az containerapp revision activate \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --revision <previous-revision-name>
```

## Cost Optimization

### Azure OpenAI Pricing

- GPT-4: ~$0.03/1K tokens (input), ~$0.06/1K tokens (output)
- GPT-3.5-turbo: ~$0.001/1K tokens (input), ~$0.002/1K tokens (output)

### Estimated Costs (GPT-3.5-turbo)

- AI Chat: ~200 tokens per interaction = $0.0006
- AI Search: ~100 tokens per search = $0.0003
- Product Q&A: ~150 tokens per question = $0.0005
- Recommendations: ~200 tokens per product page = $0.0006

**Monthly estimate for 10,000 users:**
- 50 chat interactions: $30/month
- 1000 searches: $30/month
- 500 Q&A: $25/month
- 5000 product views: $300/month
- **Total: ~$385/month**

### Cost Reduction Strategies

1. **Use GPT-3.5-turbo instead of GPT-4** (20x cheaper)
2. **Implement caching** for common queries
3. **Reduce max_tokens** in API calls
4. **Enable only essential features** initially
5. **Set up budget alerts** in Azure

```bash
# Set up cost alert
az consumption budget create \
  --budget-name magiccommerce-ai-budget \
  --amount 500 \
  --time-grain Monthly \
  --time-period start-date=2025-01-01 \
  --category Cost \
  --resource-group rg-magiccommerce
```

## Security Best Practices

1. **Never commit API keys** to the repository
2. Use **GitHub Secrets** and **Azure App Configuration** (or Container App env vars) for production secrets
3. **Do not introduce new Key Vault dependencies** for this app; secrets are env-driven
4. **Implement rate limiting** on AI endpoints
5. **Monitor for abuse** via Application Insights
6. **Rotate API keys** regularly

### Implement Rate Limiting

Add to your API routes:

```javascript
// Example rate limiting middleware
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
```

## Troubleshooting

### Issue: AI features not working

**Solution:**
```bash
# Check environment variables
az containerapp show \
  --name magiccommerce \
  --resource-group rg-magiccommerce \
  --query "properties.template.containers[0].env" -o table

# Verify Azure OpenAI endpoint is accessible
curl -X POST "https://your-instance.openai.azure.com/openai/deployments/gpt-5.1/chat/completions?api-version=2025-01-01-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: your-api-key" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

### Issue: High latency

**Solutions:**
- Reduce `max_tokens` parameter
- Increase Azure OpenAI capacity
- Implement response caching
- Use lower temperature for faster responses

### Issue: Rate limiting errors

**Solutions:**
- Upgrade Azure OpenAI tier
- Implement request queuing
- Add retry logic with exponential backoff
- Cache common responses

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] AI features working on homepage
- [ ] Search returning relevant results
- [ ] Product Q&A responding correctly
- [ ] Recommendations showing related products
- [ ] Application logs show no configuration warnings
- [ ] Azure OpenAI usage metrics being tracked
- [ ] Cost alerts configured
- [ ] Rollback plan tested
- [ ] Documentation updated
- [ ] Team trained on new features

## Support

For deployment issues:
- Check application logs in Container Apps
- Review Azure OpenAI metrics
- Verify all environment variables
- Test API endpoints directly
- Contact Azure support if needed
