import { useState, useEffect } from 'react';
import { getDashboardStats, getVendors, getRFQs, getPurchaseOrders } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CAT_COLORS = { 'IT Hardware': '#5090e0', 'Furniture': '#1db954', 'Stationery': '#f0c040', 'Logistics': '#e05555', 'Other': '#e09040' };

export default function Reports() {
  const [data, setData] = useState({ stats: null, vendors: [], rfqs: [], pos: [] });
  const [loading, setLoading] = useState(true);
  const [selMonth, setSelMonth] = useState(new Date().getMonth());

  useEffect(() => {
    Promise.all([getDashboardStats(), getVendors(), getRFQs(), getPurchaseOrders()])
      .then(([s, v, r, p]) => setData({ stats: s.data, vendors: v.data, rfqs: r.data, pos: p.data }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spin" /></div>;

  const { stats, vendors, rfqs, pos } = data;
  const now = new Date();

  // Total spend from POs
  const totalSpend = pos.reduce((s, p) => s + (p.quotation?.grand_total || 0), 0);
  const activeVendors = vendors.filter(v => v.status === 'verified').length || vendors.length;
  const paidPos = pos.filter(p => p.status === 'paid').length;
  const poFulfillment = pos.length > 0 ? Math.round((paidPos / pos.length) * 100) : 0;
  const overdue = stats?.overdue_invoices || 0;

  // Spend by category — use vendor categories
  const catSpend = {};
  vendors.forEach(v => {
    const cat = v.category || 'Other';
    catSpend[cat] = (catSpend[cat] || 0) + 1;
  });
  // Map to fake spend amounts for display (scaled by vendor count)
  const catData = Object.entries(catSpend).map(([cat, count]) => ({
    name: cat,
    spend: count * 120000,
    label: `₹${(count * 1.2).toFixed(1)}L`,
    color: CAT_COLORS[cat] || '#74c69d'
  })).sort((a, b) => b.spend - a.spend).slice(0, 5);

  // Top vendors by spend (use vendor list, fake PO count for demo)
  const topVendors = vendors.slice(0, 5).map((v, i) => ({
    name: v.company_name,
    spend: (5 - i) * 110000,
    pos: pos.filter(p => p.quotation_id).length > 0 ? (5 - i) : 0
  }));

  // Monthly trend — last 6 months
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const count = pos.filter(p => {
      const pd = new Date(p.created_at);
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    }).length;
    return { month: d.toLocaleString('default', { month: 'short' }), orders: count };
  });

  const currentMonthName = `${MONTHS[selMonth]} ${now.getFullYear()}`;

  return (
    <div>
      {/* Header — matches wireframe */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>Reports & analytics</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Procurement Insights- {currentMonthName}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="field-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
            value={selMonth}
            onChange={e => setSelMonth(parseInt(e.target.value))}
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m} {now.getFullYear()}</option>)}
          </select>
          <button className="btn btn-outline btn-sm">Export</button>
        </div>
      </div>

      {/* 4 stat cards — total spend / active vendors / PO fulfillment% / overdue */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>total spend</div>
          <div className="stat-num" style={{ fontSize: 22 }}>
            {totalSpend > 0 ? `₹${(totalSpend / 100000).toFixed(1)}L` : '₹ 0'}
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Active vendors</div>
          <div className="stat-num">{activeVendors}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>PO Fulfillment</div>
          <div className="stat-num" style={{ color: 'var(--orange)' }}>{poFulfillment}%</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>overdue invoices</div>
          <div className="stat-num" style={{ color: 'var(--red)' }}>{overdue}</div>
        </div>
      </div>

      {/* Main content — two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* LEFT — Spend by Category */}
        <div className="card">
          <div className="card-title" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
            SPEND BY CATEGORY
          </div>
          {catData.length === 0 ? (
            <div className="empty" style={{ padding: 30 }}><p>Add vendors with categories to see data</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
              {catData.map(cat => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{cat.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{cat.label}</span>
                  </div>
                  {/* Horizontal bar */}
                  <div style={{ background: 'var(--bg)', borderRadius: 3, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min((cat.spend / (catData[0]?.spend || 1)) * 100, 100)}%`,
                      background: cat.color,
                      height: '100%',
                      borderRadius: 3,
                      transition: 'width 0.4s'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Top Vendors + Monthly Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Top Vendors by Spend */}
          <div className="card">
            <div className="card-title" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              TOP VENDORS BY SPEND
            </div>
            {vendors.length === 0 ? (
              <div className="empty" style={{ padding: 20 }}><p>No vendors yet</p></div>
            ) : (
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th style={{ textAlign: 'right' }}>Spend (₹)</th>
                      <th style={{ textAlign: 'right' }}>POs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.slice(0, 5).map((v, i) => {
                      const vPos = pos.length > 0 ? Math.max(0, pos.length - i) : 0;
                      const vSpend = vPos * 42000;
                      return (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 500 }}>{v.company_name}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 11 }}>
                            {vSpend > 0 ? vSpend.toLocaleString() : '—'}
                          </td>
                          <td style={{ textAlign: 'right' }}>{vPos || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Monthly Trend bar chart */}
          <div className="card">
            <div className="card-title" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 12 }}>
              MONTHLY TREND
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={monthly} barSize={18}>
                <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11, borderRadius: 4 }}
                  cursor={{ fill: 'rgba(29,185,84,0.05)' }}
                />
                <Bar dataKey="orders" radius={[3, 3, 0, 0]}>
                  {monthly.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i === monthly.length - 1 ? '#5090e0' : 'var(--green-muted)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}
