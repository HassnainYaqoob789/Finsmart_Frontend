import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import Admin from '@/pages/Admin';

// Lazy-loaded pages
const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const ProductCategory = lazy(() => import('@/pages/ProductCategory'));
const Product = lazy(() => import('@/pages/Product'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));
const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));
const Quote = lazy(() => import('@/pages/Quote/index'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));
const Settings = lazy(() => import('@/pages/Settings/Settings'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));
const Profile = lazy(() => import('@/pages/Profile'));
const About = lazy(() => import('@/pages/About'));

// Wrapper component for routing
const RoutesWrapper = () => {
  const currentAdmin = useSelector(selectCurrentAdmin);
  console.log(currentAdmin);

  // Define routes
  const routes = [
      {
        path: '/login',
        element: <Navigate to="/" />,
      },
      {
        path: '/logout',
        element: <Logout />,
      },
      {
        path: '/about',
        element: currentAdmin.email !== 'admin@finsmart.com' && <About />,
      },
      {
        path: '/',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Dashboard />,
      },
      {
        path: '/customer',
        element:currentAdmin.email !== 'admin@finsmart.com' &&  <Customer />,
      },
      {
        path: '/product-category',
        element:currentAdmin.email !== 'admin@finsmart.com' &&  <ProductCategory />,
      },
      {
        path: '/admin',
        element: currentAdmin.email === 'admin@finsmart.com' ? <Admin /> : <Navigate to="/login" />,
      },
      {
        path: '/product',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Product />,
      },
      {
        path: '/invoice',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Invoice />,
      },
      {
        path: '/invoice/create',
        element: currentAdmin.email !== 'admin@finsmart.com' && <InvoiceCreate />,
      },
      {
        path: '/invoice/read/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <InvoiceRead />,
      },
      {
        path: '/invoice/update/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <InvoiceUpdate />,
      },
      {
        path: '/invoice/pay/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <InvoiceRecordPayment />,
      },
      {
        path: '/quote',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Quote />,
      },
      {
        path: '/quote/create',
        element: currentAdmin.email !== 'admin@finsmart.com' && <QuoteCreate />,
      },
      {
        path: '/quote/read/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <QuoteRead />,
      },
      {
        path: '/quote/update/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <QuoteUpdate />,
      },
      {
        path: '/payment',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Payment />,
      },
      {
        path: '/payment/read/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <PaymentRead />,
      },
      {
        path: '/payment/update/:id',
        element: currentAdmin.email !== 'admin@finsmart.com' && <PaymentUpdate />,
      },
      {
        path: '/settings',
        element:  <Settings />,
      },
      {
        path: '/settings/edit/:settingsKey',
        element:  <Settings />,
      },
      {
        path: '/payment/mode',
        element: currentAdmin.email !== 'admin@finsmart.com' && <PaymentMode />,
      },
      {
        path: '/taxes',
        element: currentAdmin.email !== 'admin@finsmart.com' && <Taxes />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ]

  return routes;
};

export default RoutesWrapper;
