import apiClient from './api-client';
import type { DashboardDetailsResponse, DashboardItem } from '../../pages/payroll/types';

export type { DashboardDetailsResponse, DashboardItem };

export const dashboardService = {
  getMyDashboards: async (): Promise<DashboardItem[]> => {
    const response = await apiClient.get<DashboardItem[]>('/dashboards/my-dashboards');
    return response.data;
  },

  getDashboardDetails: async (id: string): Promise<DashboardDetailsResponse> => {
    const response = await apiClient.get<DashboardDetailsResponse>(`/dashboards/${id}/details`);
    return response.data;
  },

  queryDashboardAI: async (id: string, query: string): Promise<{ query: string; response: string }> => {
    const response = await apiClient.post<{ query: string; response: string }>(`/dashboards/${id}/query`, { query });
    return response.data;
  }
};
