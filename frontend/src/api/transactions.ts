import type { Process } from '../types/transactions';
import { apiGet, apiPatch } from '@/utils/api'; // adjust path

export const transactionApi = {
  list: <P extends Process>(process: P) =>
    apiGet(`/transaction/${process}/list`),

  updateStatus: <P extends Process>(
    process: P,
    payload: Record<string, any>
  ) =>
    apiPatch(`/transaction/${process}/update-status`, payload),
};
