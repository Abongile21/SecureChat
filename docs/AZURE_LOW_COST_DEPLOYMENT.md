# Low-cost Azure deployment

This demo uses only the resources required to run it:

```text
Azure Static Web Apps (Free) -> Azure App Service (one Linux app) -> PostgreSQL Flexible Server (smallest available tier)
                                                               -> OpenAI API (backend only, optional)
```

No VM, Kubernetes, Redis, Front Door, Application Gateway, private network, autoscaling, or Application Insights is required for this four-month demo. Static Web Apps provides HTTPS for the React production build. App Service provides HTTPS for the API. PostgreSQL Flexible Server is the only persistent data service.

This plan targets a Microsoft trial budget of $200 over four months. Treat $50 per month as the maximum average spend, but keep the actual operating target below $40 per month so the final month has room for price changes, tax, and trial eligibility differences. Verify current pricing and free-tier eligibility in the Azure calculator before provisioning.

## Cost guardrails

1. Check the current Azure pricing and regional free allowances before creating resources. Free quotas and eligibility change; do not assume that a free tier or the $200 trial credit is guaranteed for four months.
2. Create one resource group and one instance of each service. Do not create staging slots, replicas, high availability, read replicas, or autoscaling.
3. Choose the smallest App Service Linux plan that supports the app. Use Free only if it is available for the subscription and region and the demo accepts its limits; otherwise choose the lowest Basic/B tier and record the reason.
4. Create PostgreSQL Flexible Server in the smallest eligible burstable configuration, with minimal storage and no high availability. Stop or delete it when the demo is not needed if the selected tier continues billing while stopped.
5. Set an Azure Cost Management budget on the resource group or subscription with monthly alerts at $100, $150, $175, $190, and $200. Alerts do not stop charges automatically, so remove unnecessary paid resources when a critical alert arrives.
6. Keep OpenAI usage capped by `MAX_MESSAGE_LENGTH`, the ten-message context window, the configurable `OPENAI_MODEL` (default `gpt-4o-mini`), and the provider's own spend limit.

## Four-month operating budget

Keep the deployment to one resource group and one region. The preferred cost order is:

| Service | Budget approach |
| --- | --- |
| Static Web Apps | Free plan only; use it for the React frontend and HTTPS. |
| App Service | Free `F1` when available; otherwise use the lowest eligible Linux tier and stop the app when not testing. |
| PostgreSQL Flexible Server | Smallest eligible burstable tier, 32 GB storage, no HA or replicas; stop it outside test windows or delete it when the trial ends. |
| OpenAI | Optional; set a provider spend limit before testing and keep the key disabled when AI is not needed. |
| Monitoring | Use temporary App Service log stream only; do not add Application Insights, Log Analytics, Key Vault, storage, Redis, or networking add-ons. |

Create a Cost Management budget with alerts at `$25`, `$40`, `$50`, and `$60` each month. Alerts do not stop billing, so stop or delete paid resources when spending approaches the monthly limit. Set a weekly cost review and a month-four resource deletion reminder.

## Create Azure resources

Use the Azure portal or CLI. Replace placeholders and choose one region.

```bash
az login
az group create --name securechat-rg --location eastus

# Use the smallest eligible Linux plan. Do not enable autoscale.
az appservice plan create --name securechat-plan --resource-group securechat-rg --is-linux --sku F1
az webapp create --name <globally-unique-api-name> --resource-group securechat-rg --plan securechat-plan --runtime "NODE:20-lts"

# Create one small PostgreSQL Flexible Server with no HA.
az postgres flexible-server create --resource-group securechat-rg --name <globally-unique-db-name> \
  --location eastus --sku-name Burstable_B1ms --tier Burstable --storage-size 32 \
  --version 16 --admin-user securechatadmin --admin-password <password>
az postgres flexible-server db create --resource-group securechat-rg --server-name <db-name> --database-name securechat_db

# Allow only the backend app's outbound access as appropriate for the chosen region.
az postgres flexible-server firewall-rule create --resource-group securechat-rg --name <db-name> \
  --rule-name allow-azure-services --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

The public database firewall shortcut is acceptable only for this small demo. Restrict it further or use private networking before treating the application as production infrastructure.

Create the Static Web App as a Free plan through the portal, connect the GitHub repository, and set `app_location` to `frontend` and `output_location` to `dist`. HTTPS is provided automatically.

## App Service settings

Store all backend secrets in App Service **Configuration > Application settings**, never in Git. Use either `DATABASE_URL` or the individual `DB_*` settings. The Azure PostgreSQL connection string should include SSL, for example:

```text
postgresql://securechatadmin:<password>@<db-name>.postgres.database.azure.com:5432/securechat_db?sslmode=require
```

Set these settings:

```text
NODE_ENV=production
PORT=8080
DATABASE_URL=<connection string>
DB_POOL_MAX=5
JWT_SECRET=<long random value>
JWT_EXPIRE=7d
FRONTEND_URL=https://<static-web-app-host>.azurestaticapps.net
OPENAI_API_KEY=<optional provider key>
OPENAI_MODEL=gpt-4o-mini
LOG_LEVEL=info
```

The frontend receives only `VITE_API_URL=https://<api-name>.azurewebsites.net/api`. Never put `OPENAI_API_KEY`, `DATABASE_URL`, `DB_PASSWORD`, or `JWT_SECRET` in a `VITE_*` variable.

## Deployment and verification

The repository workflow `.github/workflows/deploy-azure.yml` builds both applications, runs the backend test command, runs Knex migrations once using the database connection, deploys the React build to Static Web Apps, and deploys one backend package to App Service. Configure these GitHub secrets before enabling it:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `DATABASE_URL`

After deployment, verify in order:

```text
GET https://<api-name>.azurewebsites.net/health
Register a demo account in the frontend
Log in and confirm the token is accepted by /api/chat/start
Send one short AI message
Reload and confirm the stored conversation history is loaded
```

Run migrations before deploying code that depends on a new schema. Knex migrations are forward-only in the workflow; take a database backup before a destructive migration.

## Cheap monitoring

Use App Service Log stream only while diagnosing an issue and keep retention low. The API writes structured console logs without passwords, tokens, API keys, or message content. Do not add Application Insights, Log Analytics, alerts, storage accounts, Key Vault, or another monitoring service for this demo unless a specific operational need justifies the additional cost.
