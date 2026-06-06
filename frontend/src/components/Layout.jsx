import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/dashboard': 'Main Landing Page',
  '/vendors': 'Vendor Management',
  '/rfqs': "RFQ's Page",
  '/quotations/compare': 'Quotations Comparison',
  '/quotations': 'Quotation Submission',
  '/approvals': 'Approval Page',
  '/purchase-orders': 'PO & Invoice',
  '/invoices': 'PO & Invoice',
  '/reports': 'Reports & Analytics',
  '/activity': 'Activity & Logs',
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  const title =
    Object.entries(TITLES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([k]) => location.pathname.startsWith(k))?.[1] ||
    'VendorBridge';

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrap">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            <div className="topbar-subtitle">
              Procurement Management Platform
            </div>
          </div>

          <div className="topbar-right">
            <div className="user-chip">
              <div className="avatar">
                {(user?.full_name || 'U')[0].toUpperCase()}
              </div>

              <div className="user-meta">
                <div className="user-name">
                  {user?.full_name}
                </div>

                <div className="user-role">
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}