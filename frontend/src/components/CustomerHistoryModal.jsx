import { useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const STATUS_STYLE = {
  paid: "bg-green-900/60 text-green-300",
  pending: "bg-yellow-900/60 text-yellow-300",
  overdue: "bg-red-900/60 text-red-300",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

function CustomerHistoryModal({ isOpen, onClose, customer = null, invoices = [] }) {
  const { orders, totalSpent, totalItems } = useMemo(() => {
    if (!customer) return { orders: [], totalSpent: 0, totalItems: 0 };

    const orders = invoices
      .filter((inv) => (inv.customer?._id || inv.customer) === customer._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalSpent = orders.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalItems = orders.reduce(
      (sum, inv) =>
        sum +
        (inv.products || []).reduce((qty, item) => qty + (item.quantity || 0), 0),
      0
    );

    return { orders, totalSpent, totalItems };
  }, [customer, invoices]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase History" size="2xl">
      {customer && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-900 text-lg font-semibold text-blue-400">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-100">
                {customer.name}
              </p>
              <p className="truncate text-sm text-gray-400">{customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Orders", value: orders.length },
              { label: "Items bought", value: totalItems },
              { label: "Total spent", value: `$${totalSpent.toFixed(2)}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3"
              >
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-100">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-950/40 py-10 text-center text-sm text-gray-500">
              No purchases yet for this customer.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((inv) => (
                <div
                  key={inv._id}
                  className="rounded-xl border border-gray-800 bg-gray-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-100">
                        {formatDate(inv.createdAt)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          #{inv.formattedInvoiceNumber || inv.invoiceNumber}
                        </span>
                        {inv.status && (
                          <span
                            className={`rounded-full px-2 py-0.5 capitalize ${
                              STATUS_STYLE[inv.status] ||
                              "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {inv.status}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="shrink-0 text-base font-semibold text-blue-400">
                      ${(inv.total || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-3 border-t border-gray-800/70">
                    {(inv.products || []).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 border-b border-gray-800/40 py-2 text-sm last:border-b-0"
                      >
                        <span className="min-w-0 truncate text-gray-300">
                          {item.product?.name || "N/A"}
                          <span className="text-gray-500"> × {item.quantity || 0}</span>
                        </span>
                        <span className="shrink-0 text-gray-200">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

CustomerHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  invoices: PropTypes.array,
};

export default CustomerHistoryModal;
