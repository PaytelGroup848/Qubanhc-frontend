import { useEffect } from 'react';

/* Load premium type pairing once: 'Sora' for display, 'Inter' for body/data */
const FONT_LINK_ID = 'invoice-template-fonts';

function useInvoiceFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

const formatCurrency = (amount = 0) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

const formatDate = (date) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function InvoiceTemplate({ invoice, order, settings }) {
  useInvoiceFonts();

  const billing = settings?.billing || {};
  const support = settings?.support || {};
  const tax = settings?.tax || {};

  const company = {
    name: billing.companyName || 'Quban HC',
    address: [
      billing.address,
      billing.city,
      billing.state,
      billing.pincode,
      billing.country,
    ]
      .filter(Boolean)
      .join(', '),
    email: billing.email || support.email || 'support@qubanhc.com',
    phone: billing.phone || support.phone || '',
    gstin: billing.gstin || tax.gstNumber || '',
    pan: billing.pan || '',
  };

  const paymentStatus =
    invoice?.paymentStatus || order?.payment?.status || 'paid';

  const invoiceNumber =
    invoice?.invoiceNumber || `INV-${order?.orderId || Date.now()}`;

  const items = Array.isArray(order?.items) ? order.items : [];

  const logoInitials = (company.name || 'QH')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="relative w-[794px] min-h-[1123px] bg-white p-12 text-[#0b1220] overflow-hidden"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Top signature bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0b1220] via-[#1d2c4d] to-[#0f9d70]" />

      {/* Watermark */}
      <div
        className="pointer-events-none select-none absolute -right-16 top-24 text-[220px] font-extrabold leading-none tracking-tighter text-[#0b1220] opacity-[0.025] whitespace-nowrap"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        PAID
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-4">
              <div
                className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#223055] text-sm font-bold text-white"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {logoInitials}
              </div>

              <div>
                <h1
                  className="text-[22px] font-bold tracking-tight text-[#0b1220]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {company.name}
                </h1>
                <p className="mt-0.5 text-xs font-semibold tracking-wide text-slate-400">
                  Premium Healthcare & Lifestyle Store
                </p>
              </div>
            </div>

            <div className="mt-4 max-w-xs text-xs leading-[19px] text-slate-500">
              {company.address && <p>{company.address}</p>}
              {company.email && <p>Email: {company.email}</p>}
              {company.phone && <p>Phone: {company.phone}</p>}
              {company.gstin && <p>GSTIN: {company.gstin}</p>}
              {company.pan && <p>PAN: {company.pan}</p>}
            </div>
          </div>

          <div className="min-w-[200px] text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Tax Invoice
            </p>
            <h2
              className="mt-1.5 text-[34px] font-extrabold uppercase tracking-tight text-[#0b1220]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Invoice
            </h2>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {paymentStatus}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-7 grid grid-cols-2 gap-4">
          <div className="rounded-[14px] border border-slate-100 bg-slate-50/60 p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Bill To
            </h3>

            <div className="mt-3 text-[12.5px] leading-[19px] text-[#414a5c]">
              <p
                className="mb-0.5 text-[15px] font-bold text-[#0b1220]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {order?.customerName || '-'}
              </p>
              <p>{order?.customerEmail || '-'}</p>
              <p>{order?.customerPhone || '-'}</p>

              <p className="mt-2">
                {[
                  order?.shippingAddress?.addressLine1,
                  order?.shippingAddress?.addressLine2,
                  order?.shippingAddress?.city,
                  order?.shippingAddress?.state,
                  order?.shippingAddress?.pincode,
                  order?.shippingAddress?.country,
                ]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </p>
            </div>
          </div>

          <div className="rounded-[14px] border border-slate-100 bg-slate-50/60 p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Invoice Details
            </h3>

            <div className="mt-3 space-y-1.5 text-[12.5px]">
              <Row label="Invoice No" value={invoiceNumber} />
              <Row label="Order ID" value={order?.orderId || '-'} />
              <Row
                label="Invoice Date"
                value={formatDate(invoice?.createdAt || new Date())}
              />
              <Row
                label="Payment Method"
                value={(order?.payment?.method || '-').toUpperCase()}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-7 overflow-hidden rounded-[14px] border border-slate-100">
          <table className="w-full text-[12.5px]">
            <thead className="bg-[#0b1220] text-white">
              <tr>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider">
                  Item
                </th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">
                  Price
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#0b1220]">{item.name}</p>

                      {item.variantName && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          Variant: {item.variantName}
                        </p>
                      )}

                      {item.sku && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          SKU: {item.sku}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center font-semibold text-[#414a5c]">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-[#414a5c]">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="px-5 py-4 text-right font-extrabold text-[#0b1220]">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-7 flex justify-end">
          <div className="w-[300px] rounded-[14px] border border-slate-100 bg-slate-50/60 p-5">
            <TotalRow label="Subtotal" value={order?.subtotal} />
            <TotalRow label="Discount" value={-(order?.discountAmount || 0)} />
            <TotalRow label="Shipping" value={order?.shippingCharge} />
            <TotalRow
              label={`GST (${order?.taxRate || tax?.defaultGSTRate || 0}%)`}
              value={order?.taxAmount}
            />

            <div className="my-3.5 border-t border-dashed border-slate-200" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0b1220]">Grand Total</span>
              <span
                className="text-[21px] font-extrabold tracking-tight text-[#0f9d70]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {formatCurrency(order?.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-[14px] border border-slate-100 bg-slate-50/60 p-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Notes
            </h4>
            <p className="mt-2 text-[12.5px] leading-[19px] text-slate-500">
              Thank you for shopping with {company.name}. For support, contact{' '}
              {company.email}.
            </p>
          </div>

          <div className="rounded-[14px] border border-slate-100 bg-slate-50/60 p-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Declaration
            </h4>
            <p className="mt-2 text-[12.5px] leading-[19px] text-slate-500">
              This is a computer-generated invoice and does not require a physical
              signature.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-100 pt-4 text-center text-[11.5px] font-medium text-slate-400">
          <p>
            Invoice generated by {company.name} · {company.email || 'support@qubanhc.com'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-[#0b1220]">{value}</span>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="mb-2.5 flex items-center justify-between text-[12.5px]">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-[#0b1220]">
        {formatCurrency(value)}
      </span>
    </div>
  );
}