// useRouteElements.jsx
import * as React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { AppContext } from './contexts/app.context';
import AdminLayout from './layouts/AdminLayout';
import RegisterLayout from './layouts/RegisterLayout';
import RoleProtectedRoute from './RoleProtectedRoute';

// Import các trang
import Dashboard from './pages/Dashboard';
import LuuVet from './pages/LuuVet';
import Login from './pages/Login';
import Comment from './pages/Comment';
import Contact from './pages/Contact';
import Users from './pages/Users';
import Products from './pages/Product';
import Categories from './pages/Category';
import Oders from './pages/Order';
import Messages from './pages/Message';
import Brand from './pages/Brand';
import Payment from './pages/Payment';
import Custommer from './pages/Custommer';
import PaymentHistory from './pages/PaymentHistory';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Notify from './pages/Notify';
import Ip from './pages/Ip';
import IdRefByStaff from './pages/idRef';
import AddProduct from './pages/AddProduct';
import MessageByEmployee from './pages/MessageByEmployee';
import Unauthorized from './pages/Unauthorized';
import OrderSpecial from './pages/OrderSpecial';
import SetOrderProduct from './pages/SetOrderProduct';

function ProtectedRoute() {
  const { isAuthenticated } = React.useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
  const { isAuthenticated } = React.useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

const useRouteElements = () => {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },
      ],
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        // Các route dành cho mọi người dùng đã đăng nhập
        {
          path: '/',
          index: true,
          element: (
            <AdminLayout title="Dashboard">
              <Dashboard />
            </AdminLayout>
          ),
        },
        {
          path: '/contact',
          element: (
            <AdminLayout title="Danh sách liên hệ">
              <Contact />
            </AdminLayout>
          ),
        },
        {
          path: '/custommer',
          element: (
            <AdminLayout title="Danh sách khách hàng">
              <Custommer />
            </AdminLayout>
          ),
        },
        {
          path: '/add-product',
          element: (
            <AdminLayout title="Danh sách đăng kí khách hàng bán hàng">
              <AddProduct />
            </AdminLayout>
          ),
        },
        {
          path: '/product',
          element: (
            <AdminLayout title="Danh sách sản phẩm">
              <Products />
            </AdminLayout>
          ),
        },
        {
          path: '/order',
          element: (
            <AdminLayout title="Danh sách đơn hàng">
              <Oders />
            </AdminLayout>
          ),
        },
        {
          path: '/order-special',
          element: (
            <AdminLayout title="Danh sách đơn hàng đặc biệt">
              <OrderSpecial />
            </AdminLayout>
          ),
        },
        {
          path: '/notify',
          element: (
            <AdminLayout title="Danh sách thông báo">
              <Notify />
            </AdminLayout>
          ),
        },
        {
          path: '/payment-history',
          element: (
            <AdminLayout title="Lịch sử giao dịch">
              <PaymentHistory />
            </AdminLayout>
          ),
        },
        // ... các route khác dành cho mọi người dùng

        // Các route chỉ dành cho Admin
        {
          path: '',
          // element: <RoleProtectedRoute requiredRoles={['isAdmin']} />,
          children: [
            {
              path: '/user',
              element: (
                <AdminLayout title="Danh sách nhân viên">
                  <Users />
                </AdminLayout>
              ),
            },
            {
              path: '/id-ref',
              element: (
                <AdminLayout title="Danh sách mã giới thiệu">
                  <IdRefByStaff />
                </AdminLayout>
              ),
            },
            {
              path: '/message',
              element: (
                <AdminLayout title="Danh sách tin nhắn">
                  <Messages />
                </AdminLayout>
              ),
            },
            {
              path: '/set-order-product',
              element: (
                <AdminLayout title='Danh sách đơn đã thêm cho khách hàng'>
                  <SetOrderProduct />
                </AdminLayout>
              )
            },
            {
              path: '/settings',
              element: (
                <AdminLayout title="Cài đặt chức năng">
                  <Settings />
                </AdminLayout>
              ),
            },
            // ... các route khác chỉ dành cho Admin
          ],
        },

        // Các route chỉ dành cho Nhân viên
        {
          path: '',
          // element: <RoleProtectedRoute requiredRoles={['isStaff']} />,
          children: [
            {
              path: '/message-customer',
              element: (
                <AdminLayout title="Danh sách tin nhắn">
                  <MessageByEmployee />
                </AdminLayout>
              ),
            },
            // ... các route khác chỉ dành cho Nhân viên
          ],
        },

        // Các route dành cho cả Admin và Nhân viên
        {
          path: '',
          children: [
            {
              path: '/luu-vet',
              element: (
                <AdminLayout title="Lịch sử hoạt động">
                  <LuuVet />
                </AdminLayout>
              ),
            },
            // ... các route khác dành cho cả Admin và Nhân viên
          ],
        },
      ],
    },
    {
      path: '/*',
      element: <Unauthorized />,
    },
  ]);

  return routeElements;
};

export default useRouteElements;
