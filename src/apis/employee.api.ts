
import serverGet from "~/utils/serverGet";

export const getCustomerByEmployee = (employeeId: string, page: number) =>
    serverGet.get(`v1/employee/get-customer/${employeeId}?page=${page}`);
