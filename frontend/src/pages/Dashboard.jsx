import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FileText,
  Banknote,
  Users,
  Package,
  PlusCircle,
  Inbox,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { invoicesAPI, customersAPI, productsAPI } from "../services/api";

// Endpoints return different shapes: customers send a bare array, while invoices
// and products wrap their list as { data: [...] } with results/total counts.
const countOf = (res) => {
  const body = res?.data;
  if (Array.isArray(body)) return body.length;
  if (typeof body?.total === "number") return body.total;
  if (typeof body?.results === "number") return body.results;
  if (Array.isArray(body?.data)) return body.data.length;
  return 0;
};

const toArray = (res) => {
  const body = res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
};

const money = (n) =>
  `$${(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const moneyShort = (n) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k`;
  return `$${Math.round(n)}`;
};

const niceCeil = (v) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * p;
};

const statusStyle = (s) =>
  ({
    paid: "bg-green-900 text-green-300 border border-green-800",
    pending: "bg-yellow-900 text-yellow-300 border border-yellow-800",
    overdue: "bg-red-900 text-red-300 border border-red-800",
  }[s] || "bg-gray-800 text-gray-300 border border-gray-700");

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function RevenueChart({ data }) {
  const W = 520;
  const H = 200;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const n = data.length;
  const max = niceCeil(Math.max(...data.map((d) => d.value), 1));
  const x = (i) => padL + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v) => padT + ih * (1 - v / max);
  const baseline = padT + ih;

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `M ${x(0)},${baseline} L ${data
    .map((d, i) => `${x(i)},${y(d.value)}`)
    .join(" L ")} L ${x(n - 1)},${baseline} Z`;
  const ticks = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-52" preserveAspectRatio="none">
      <defs>
        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => {
        const gy = padT + ih * (1 - t);
        return (
          <g key={t}>
            <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="#1f2937" strokeWidth="1" />
            <text x={padL - 8} y={gy + 4} textAnchor="end" fontSize="10" fill="#6b7280">
              {moneyShort(max * t)}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#revFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#0a0a0a" stroke="#3b82f6" strokeWidth="2" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StatusDonut({ paid, pending, overdue }) {
  const total = paid + pending + overdue;
  const r = 64;
  const c = 90;
  const sw = 20;
  const C = 2 * Math.PI * r;
  const segs = [
    { k: "Paid", v: paid, color: "#10b981" },
    { k: "Pending", v: pending, color: "#f59e0b" },
    { k: "Overdue", v: overdue, color: "#ef4444" },
  ].filter((s) => s.v > 0);

  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="h-40 w-40 shrink-0">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#1f2937" strokeWidth={sw} />
        {total > 0 &&
          segs.map((s) => {
            const len = (s.v / total) * C;
            const el = (
              <circle
                key={s.k}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={sw}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${c} ${c})`}
              />
            );
            offset += len;
            return el;
          })}
        <text x={c} y={c - 4} textAnchor="middle" fontSize="30" fontWeight="700" fill="#ffffff">
          {total}
        </text>
        <text x={c} y={c + 18} textAnchor="middle" fontSize="12" fill="#9ca3af">
          invoices
        </text>
      </svg>
      <div className="space-y-2">
        {[
          { k: "Paid", v: paid, color: "bg-emerald-500" },
          { k: "Pending", v: pending, color: "bg-amber-500" },
          { k: "Overdue", v: overdue, color: "bg-red-500" },
        ].map((s) => (
          <div key={s.k} className="flex items-center gap-2 text-sm">
            <span className={`h-3 w-3 rounded-full ${s.color}`} />
            <span className="text-gray-300 w-16">{s.k}</span>
            <span className="text-gray-100 font-semibold">{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: invoicesData } = useQuery({ queryKey: ["invoices"], queryFn: invoicesAPI.getAll });
  const { data: customersData } = useQuery({ queryKey: ["customers"], queryFn: customersAPI.getAll });
  const { data: productsData } = useQuery({ queryKey: ["products"], queryFn: productsAPI.getAll });

  const invoices = useMemo(() => toArray(invoicesData), [invoicesData]);

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    [invoices]
  );

  const monthly = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("default", { month: "short" }),
        value: 0,
      });
    }
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const b = buckets.find((x) => x.key === key);
      if (b) b.value += inv.total || 0;
    });
    return buckets;
  }, [invoices]);

  const statusCounts = useMemo(() => {
    const c = { paid: 0, pending: 0, overdue: 0 };
    invoices.forEach((inv) => {
      if (c[inv.status] !== undefined) c[inv.status] += 1;
    });
    return c;
  }, [invoices]);

  const recent = useMemo(
    () =>
      [...invoices]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [invoices]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
        <Link
          to="/dashboard/invoices/create"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={18} />
          New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          label="Total Invoices"
          value={invoices.length}
          accent="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Banknote}
          label="Total Revenue"
          value={money(totalRevenue)}
          accent="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={countOf(customersData)}
          accent="bg-sky-500/10 text-sky-400"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={countOf(productsData)}
          accent="bg-violet-500/10 text-violet-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-100">Revenue (last 6 months)</h3>
          </div>
          <RevenueChart data={monthly} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Invoice Status</h3>
          <StatusDonut
            paid={statusCounts.paid}
            pending={statusCounts.pending}
            overdue={statusCounts.overdue}
          />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Recent Invoices</h3>
          <Link
            to="/dashboard/invoices"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <Inbox size={26} className="text-gray-500" />
            </div>
            <p className="text-gray-300 font-medium">No invoices yet</p>
            <p className="text-gray-500 text-sm mb-4">Create your first invoice to see it here.</p>
            <Link
              to="/dashboard/invoices/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={18} /> Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="py-2 pr-4 font-medium">Invoice</th>
                  <th className="py-2 pr-4 font-medium">Customer</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium text-right">Amount</th>
                  <th className="py-2 pl-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((inv) => (
                  <tr
                    key={inv._id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        to={`/dashboard/invoices/${inv._id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        #{inv.formattedInvoiceNumber || inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-200">{inv.customer?.name || "—"}</td>
                    <td className="py-3 pr-4 text-gray-400">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-100 font-semibold">
                      {money(inv.total)}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs capitalize ${statusStyle(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
