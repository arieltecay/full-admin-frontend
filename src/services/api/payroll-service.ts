import apiClient from './api-client';

export const payrollService = {
  getPayroll: async (clientId: string, period: string, page = 1, limit = 100) => {
    const response = await apiClient.get(`/payroll/${clientId}/${period}`, {
      params: { page, limit }
    });
    return response.data;
  },

  getPayrollStats: async (clientId: string, period: string, filters: any = {}) => {
    const response = await apiClient.post(`/payroll/${clientId}/${period}/stats`, { filters });
    return response.data;
  },

  /**
   * Obtiene todos los períodos de nómina para un cliente.
   */
  getPayrollPeriods: async (clientId: string) => {
    const response = await apiClient.get(`/payroll/${clientId}/periods`);
    return response.data;
  },

  /**
   * Compara dos períodos de nómina.
   */
  comparePayrolls: async (clientId: string, periodA: string, periodB: string) => {
    const response = await apiClient.get(`/payroll/${clientId}/compare`, {
      params: { periodA, periodB }
    });
    return response.data;
  }
};
