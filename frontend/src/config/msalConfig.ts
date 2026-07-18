const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '';
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || '';

export const isAzureConfigured = Boolean(clientId && tenantId);

export const azureConfig = {
  clientId,
  tenantId,
  redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
};
