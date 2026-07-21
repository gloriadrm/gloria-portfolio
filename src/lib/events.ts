// Centraliza los nombres de los eventos de GA4 para evitar strings duplicados
// y facilitar su mantenimiento.
export const AnalyticsEvent = {
  PROJECT_OPEN: 'project_open',
  GITHUB_CLICK: 'github_click',
  MEMORY_DOWNLOAD: 'memory_download',
  LINKEDIN_CLICK: 'linkedin_click',
} as const;
