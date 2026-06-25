import { useQuery } from "@tanstack/react-query";
import { invoicesAPI, customersAPI, productsAPI } from "../services/api";

// Endpoints return different shapes: customers send a bare array, while invoices
// and products wrap their list as { data: [...] } with results/total counts.
// Pull the count out of whichever shape came back.
const countOf = (res) => {
  const body = res?.data;
  if (Array.isArray(body)) return body.length;
  if (typeof body?.total === "number") return body.total;
  if (typeof body?.results === "number") return body.results;
  if (Array.isArray(body?.data)) return body.data.length;
  return 0;
};

function Dashboard() {
  const { data: invoicesData } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoicesAPI.getAll,
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers"],
    queryFn: customersAPI.getAll,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: productsAPI.getAll,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Invoices</h3>
          <p className="text-3xl font-bold text-blue-600">
            {countOf(invoicesData)}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-green-600">
            {countOf(customersData)}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-purple-600">
            {countOf(productsData)}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        {/* Add recent invoices table here */}
      </div>
    </div>
  );
}

export default Dashboard;
