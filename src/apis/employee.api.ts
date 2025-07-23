import serverGet from "~/utils/serverGet";
import http from "~/utils/http";

export const getCustomerByEmployee = (employeeId: string, page: number) =>
    serverGet.get(`v1/employee/get-customer/${employeeId}?page=${page}`);

// Facebook Customer APIs
// 1. Check facebook account existence
export const checkFacebookCustomer = (facebookAccount: string) =>
  serverGet.get(`/v1/employee/facebook-customer/check`, { params: { facebookAccount } });

// 2. Add facebook customer (staff only)
export const addFacebookCustomer = (body: { facebookAccount: string; username: string }) =>
  http.post(`/v1/employee/facebook-customer`, body);

// 3. Get all facebook customers (admin only, with search & pagination)
export const getAllFacebookCustomers = (params: {
  page?: number;
  limit?: number;
  facebookAccount?: string;
  staffUsername?: string;
  userUsername?: string;
}) => serverGet.get(`/v1/employee/facebook-customer/all`, { params });

// 4. Get facebook customers of current staff (staff only)
export const getMyFacebookCustomers = (params: { page?: number; limit?: number }) =>
  serverGet.get(`/v1/employee/facebook-customer/my`, { params });