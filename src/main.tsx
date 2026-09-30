import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Analyst from './pages/Analyst';
import Customers from './pages/Customers';
import Data from './pages/Data';
import Decisions from './pages/Decisions';
import Finance from './pages/Finance';
import Operations from './pages/Operations';
import Overview from './pages/Overview';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import { AppProvider } from './state/AppContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="sales" element={<Sales />} />
            <Route path="finance" element={<Finance />} />
            <Route path="operations" element={<Operations />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analyst" element={<Analyst />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="data" element={<Data />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
