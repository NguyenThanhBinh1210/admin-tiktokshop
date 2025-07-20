// RoleProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from './contexts/app.context';

function RoleProtectedRoute( requiredRoles:any ) {
  const { isAuthenticated, profile } = React.useContext(AppContext);

  // Kiểm tra nếu người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra nếu người dùng có ít nhất một trong các quyền yêu cầu
  const hasRequiredRole = requiredRoles.some((role:any) => profile?.isAdmin);

  if (!hasRequiredRole) {
    // Nếu không có quyền, chuyển hướng đến trang không có quyền truy cập
    return <Navigate to="/*" />;
  }

  // Nếu có quyền, render các route con
  return <Outlet />;
}

export default RoleProtectedRoute;
