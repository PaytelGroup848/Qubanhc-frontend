import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { invoiceService } from '../../services/invoice';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';

/* ------------------------------------------------------------------ */
/*  Fonts + global responsive stylesheet (injected once)              */
/*  Display: 'Sora' — geometric, confident, used for headings/numbers */
/*  Body:    'Inter' — high legibility workhorse for data-dense areas */
/* ------------------------------------------------------------------ */
const GLOBAL_STYLE_ID = 'invoice-page-premium-styles';

function useInjectInvoiceStyles() {
  useEffect(() => {
    if (document.getElementById(GLOBAL_STYLE_ID)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = GLOBAL_STYLE_ID;
    style.innerHTML = `
      .inv-page-root, .inv-page-root * { box-sizing: border-box; }
      .inv-page-root {
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
        background: radial-gradient(120% 120% at 0% 0%, #f6f8fb 0%, #eef1f6 55%, #e9edf3 100%);
        min-height: 100%;
        padding: 20px;
        color: #0b1220;
      }
      .inv-display { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

      .inv-toolbar {
        max-width: 1180px;
        margin: 0 auto 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        border-radius: 20px;
        background: #ffffff;
        border: 1px solid #e6e9f0;
        padding: 20px 24px;
        box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 8px 24px -12px rgba(15,23,42,.10);
        flex-wrap: wrap;
      }
      .inv-back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        text-decoration: none;
        transition: color .15s ease;
      }
      .inv-back-link:hover { color: #0b1220; }
      .inv-toolbar h1 {
        margin: 10px 0 0;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0b1220;
      }
      .inv-toolbar p { margin: 4px 0 0; font-size: 13px; color: #7c8698; }

      .inv-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        padding: 11px 18px;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
        transition: transform .12s ease, box-shadow .12s ease, background-color .15s ease;
        white-space: nowrap;
      }
      .inv-btn:active { transform: translateY(1px); }
      .inv-btn-ghost {
        background: #ffffff;
        border-color: #e2e6ee;
        color: #33394a;
      }
      .inv-btn-ghost:hover { background: #f8f9fc; }
      .inv-btn-primary {
        background: linear-gradient(180deg, #14213d 0%, #0b1220 100%);
        color: #ffffff;
        box-shadow: 0 8px 20px -8px rgba(11,18,32,.55);
      }
      .inv-btn-primary:hover { box-shadow: 0 10px 24px -8px rgba(11,18,32,.65); }
      .inv-btn-primary:disabled {
        background: #cbd2de;
        color: #ffffff;
        box-shadow: none;
        cursor: not-allowed;
      }

      .inv-canvas-wrap {
        max-width: 1180px;
        margin: 0 auto;
        overflow-x: auto;
        border-radius: 20px;
        background: #dfe4ec;
        border: 1px solid #e2e6ee;
        padding: 24px;
      }
      .inv-canvas-inner { width: fit-content; margin: 0 auto; }

      .inv-doc {
        position: relative;
        width: 794px;
        max-width: 794px;
        min-height: 1123px;
        background: #ffffff;
        color: #0b1220;
        padding: 48px 52px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 30px 60px -25px rgba(15,23,42,.25);
        border-radius: 4px;
      }
      .inv-doc::before {
        content: '';
        position: absolute;
        inset: 0 0 auto 0;
        height: 6px;
        background: linear-gradient(90deg, #0b1220 0%, #1d2c4d 45%, #0f9d70 100%);
      }
      .inv-watermark {
        position: absolute;
        right: -60px;
        top: 90px;
        font-size: 220px;
        font-weight: 800;
        color: #0b1220;
        opacity: 0.025;
        letter-spacing: -0.04em;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
      }

      .inv-header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        padding-bottom: 28px;
        border-bottom: 1px solid #e6e9f0;
      }
      .inv-brand { display: flex; align-items: center; gap: 14px; }
      .inv-logo {
        height: 52px; width: 52px;
        border-radius: 14px;
        background: linear-gradient(155deg, #0b1220 0%, #223055 100%);
        color: #ffffff;
        display: flex; align-items: center; justify-content: center;
        font-size: 15px; font-weight: 700; letter-spacing: .02em;
        flex-shrink: 0;
      }
      .inv-company-name { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #0b1220; }
      .inv-tagline { margin: 2px 0 0; font-size: 12px; font-weight: 600; color: #8b93a3; letter-spacing: .01em; }
      .inv-company-info { margin-top: 16px; max-width: 320px; font-size: 12px; line-height: 19px; color: #5b6479; }
      .inv-company-info p { margin: 0; }

      .inv-title-wrap { text-align: right; min-width: 200px; }
      .inv-eyebrow {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .22em; color: #9aa2b1; margin: 0;
      }
      .inv-title { margin-top: 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.03em; color: #0b1220; }
      .inv-badge {
        margin-top: 16px;
        display: inline-flex; align-items: center; gap: 6px;
        border-radius: 999px;
        padding: 7px 16px;
        font-size: 11px; font-weight: 700;
        text-transform: uppercase; letter-spacing: .12em;
        background: #ecfdf5; color: #047857;
        border: 1px solid #bbf3d8;
      }
      .inv-badge-dot { height: 6px; width: 6px; border-radius: 999px; background: #10b981; }

      .inv-info-grid {
        margin-top: 28px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .inv-card {
        border: 1px solid #eceff4;
        border-radius: 14px;
        background: #fafbfd;
        padding: 18px 20px;
      }
      .inv-card-title {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .1em; color: #9aa2b1; margin: 0;
      }
      .inv-card-body { margin-top: 12px; font-size: 12.5px; line-height: 19px; color: #414a5c; }
      .inv-customer-name { font-size: 15px; font-weight: 700; color: #0b1220; margin: 0 0 3px; }
      .inv-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 7px; font-size: 12.5px; }
      .inv-row:last-child { margin-bottom: 0; }
      .inv-row-label { color: #8b93a3; }
      .inv-row-value { color: #0b1220; font-weight: 600; text-align: right; }

      .inv-table-wrap {
        margin-top: 28px;
        overflow: hidden;
        border-radius: 14px;
        border: 1px solid #eceff4;
      }
      .inv-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
      .inv-th {
        background: #0b1220; color: #ffffff;
        padding: 13px 20px; font-weight: 600;
        font-size: 11px; text-transform: uppercase; letter-spacing: .08em;
      }
      .inv-td { padding: 15px 20px; border-bottom: 1px solid #f2f4f8; color: #414a5c; vertical-align: top; }
      .inv-table tbody tr:last-child .inv-td { border-bottom: none; }
      .inv-item-name { margin: 0; font-weight: 700; color: #0b1220; }
      .inv-small { margin-top: 3px; font-size: 11px; color: #9aa2b1; }

      .inv-summary-wrap { margin-top: 28px; display: flex; justify-content: flex-end; }
      .inv-summary-card {
        width: 300px;
        border-radius: 14px;
        border: 1px solid #eceff4;
        background: #fafbfd;
        padding: 20px;
      }
      .inv-total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12.5px; color: #414a5c; }
      .inv-divider { margin: 14px 0; border-top: 1px dashed #dde1ea; }
      .inv-grand { display: flex; justify-content: space-between; align-items: center; }
      .inv-grand-label { font-size: 14px; font-weight: 700; color: #0b1220; }
      .inv-grand-value { font-size: 21px; font-weight: 800; color: #0f9d70; letter-spacing: -0.02em; }

      .inv-notes-grid { margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .inv-note-box { border-radius: 14px; background: #fafbfd; border: 1px solid #eceff4; padding: 18px 20px; }
      .inv-note-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; margin: 0; }
      .inv-note-text { margin-top: 8px; font-size: 12.5px; line-height: 19px; color: #5b6479; }

      .inv-footer {
        margin-top: 32px; padding-top: 18px; border-top: 1px solid #eceff4;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 11.5px; font-weight: 600; color: #9aa2b1;
      }

      .inv-loading-wrap, .inv-empty-wrap {
        min-height: 70vh; display: flex; align-items: center; justify-content: center;
      }
      .inv-loading-pill {
        display: flex; align-items: center; gap: 10px;
        border-radius: 14px; background: #ffffff; padding: 14px 22px;
        box-shadow: 0 1px 2px rgba(15,23,42,.05), 0 12px 24px -14px rgba(15,23,42,.25);
        font-size: 13.5px; font-weight: 600; color: #475569;
      }
      .spin { animation: inv-spin 0.9s linear infinite; }
      @keyframes inv-spin { to { transform: rotate(360deg); } }

      .inv-empty-card {
        max-width: 460px; margin: 0 auto; text-align: center;
        border-radius: 20px; border: 1px solid #e6e9f0; background: #ffffff;
        padding: 40px 32px; box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 20px 40px -20px rgba(15,23,42,.2);
      }
      .inv-empty-card h2 { font-size: 19px; font-weight: 700; color: #0b1220; margin: 0; }
      .inv-empty-card p { margin-top: 8px; font-size: 13.5px; color: #7c8698; }

      /* ---------------- Responsive breakpoints ---------------- */
      @media (max-width: 860px) {
        .inv-canvas-wrap { padding: 12px; border-radius: 16px; }
        .inv-toolbar { padding: 16px; border-radius: 16px; }
      }

      @media (max-width: 640px) {
        .inv-page-root { padding: 12px; }
        .inv-toolbar { flex-direction: column; align-items: stretch; }
        .inv-toolbar > div:last-child { display: flex; gap: 8px; }
        .inv-btn { flex: 1; justify-content: center; }

        /* Scale the fixed-width A4 document down to fit small screens */
        .inv-canvas-inner {
          transform: scale(0.46);
          transform-origin: top left;
          margin: 0;
          width: 794px;
        }
        .inv-canvas-wrap {
          height: calc(1123px * 0.46 + 24px);
        }
      }

      @media (min-width: 641px) and (max-width: 860px) {
        .inv-canvas-inner { transform: scale(0.72); transform-origin: top left; width: 794px; }
        .inv-canvas-wrap { height: calc(1123px * 0.72 + 32px); }
      }

      @media print {
        .inv-toolbar { display: none; }
        .inv-canvas-wrap { background: none; border: none; padding: 0; }
        .inv-doc { box-shadow: none; }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

const formatCurrency = (amount = 0) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

const formatDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

function extractPayload(response) {
  const root = response?.data || response || {};
  const inner = root?.data || root;

  const invoice = inner?.invoice || null;
  const settings = inner?.settings || {};

  const order =
    invoice?.order && typeof invoice.order === 'object'
      ? invoice.order
      : null;

  return {
    invoice,
    order,
    settings,
  };
}

export default function InvoicePage({
  backUrl = '/admin/orders',
  backLabel = 'Back to Orders',
}) {
  useInjectInvoiceStyles();

  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const finalOrderId = id || orderId;

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (finalOrderId) {
      loadInvoice();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalOrderId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);

      try {
        await invoiceService.generateInvoice(finalOrderId);
      } catch (generateError) {
        console.warn('Invoice generate warning:', generateError);
      }

      const response = await invoiceService.getInvoiceByOrder(finalOrderId);

      const { invoice, order, settings } = extractPayload(response);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (!order) {
        console.error('Invoice fetched but order is not populated:', invoice);
        throw new Error('Order data is not populated from backend');
      }

      setInvoiceData({
        invoice,
        order,
        settings,
      });
    } catch (error) {
      console.error('Invoice load error:', error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to load invoice'
      );
      setInvoiceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      if (!invoiceRef.current) {
        throw new Error('Invoice template not ready');
      }

      const invoiceNumber =
        invoiceData?.invoice?.invoiceNumber ||
        invoiceData?.order?.orderId ||
        'invoice';

      await downloadInvoicePdf(invoiceRef.current, `${invoiceNumber}.pdf`);

      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error(error.message || 'Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="inv-page-root">
        <div className="inv-loading-wrap">
          <div className="inv-loading-pill">
            <Loader2 size={18} className="spin" />
            <span>Loading invoice...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="inv-page-root">
        <div className="inv-empty-wrap">
          <div className="inv-empty-card">
            <h2 className="inv-display">Invoice not found</h2>
            <p>Invoice could not be generated or fetched.</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inv-btn inv-btn-primary"
              style={{ marginTop: '20px' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inv-page-root">
      {/* Top Actions */}
      <div className="inv-toolbar">
        <div>
          <Link to={backUrl} className="inv-back-link">
            <ArrowLeft size={15} />
            {backLabel}
          </Link>

          <h1 className="inv-display">Invoice Preview</h1>
          <p>Same invoice page for admin and customer.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={loadInvoice} className="inv-btn inv-btn-ghost">
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inv-btn inv-btn-primary"
          >
            {downloading ? (
              <>
                <Loader2 size={15} className="spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={15} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Canvas */}
      <div className="inv-canvas-wrap">
        <div className="inv-canvas-inner">
          <div ref={invoiceRef}>
            <InvoiceDesign
              invoice={invoiceData.invoice}
              order={invoiceData.order}
              settings={invoiceData.settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceDesign({ invoice, order, settings }) {
  const billing = settings?.billing || {};
  const support = settings?.support || {};
  const tax = settings?.tax || {};

  const companyAddress =
    [
      billing.address,
      billing.addressLine1,
      billing.addressLine2,
      billing.city,
      billing.state,
      billing.pincode,
      billing.country,
    ]
      .filter(Boolean)
      .join(', ') || 'India';

  const company = {
    name: billing.companyName || billing.name || 'Quban HC',
    address: companyAddress,
    email: billing.email || support.email || 'support@qubanhc.com',
    phone: billing.phone || support.phone || '',
    gstin: billing.gstin || billing.gstNumber || tax.gstNumber || '',
    pan: billing.pan || '',
  };

  const invoiceNumber =
    invoice?.invoiceNumber || `INV-${order?.orderId || Date.now()}`;

  const paymentStatus =
    invoice?.paymentStatus || order?.payment?.status || 'paid';

  const customer = {
    name:
      order?.customerName ||
      order?.user?.name ||
      invoice?.customerName ||
      order?.shippingAddress?.fullName ||
      '-',

    email:
      order?.customerEmail ||
      order?.user?.email ||
      invoice?.customerEmail ||
      '-',

    phone:
      order?.customerPhone ||
      order?.user?.phone ||
      invoice?.customerPhone ||
      order?.shippingAddress?.phone ||
      '-',
  };

  const totals = {
    subtotal: order?.subtotal ?? invoice?.subtotal ?? 0,
    discountAmount: order?.discountAmount ?? invoice?.discountAmount ?? 0,
    shippingCharge: order?.shippingCharge ?? invoice?.shippingCharge ?? 0,
    taxAmount: order?.taxAmount ?? invoice?.taxAmount ?? 0,
    total: order?.total ?? invoice?.total ?? 0,
    taxRate: order?.taxRate ?? tax?.defaultGSTRate ?? 0,
  };

  const items =
    Array.isArray(order?.items) && order.items.length > 0 ? order.items : [];

  const customerAddress =
    [
      order?.shippingAddress?.addressLine1,
      order?.shippingAddress?.addressLine2,
      order?.shippingAddress?.city,
      order?.shippingAddress?.state,
      order?.shippingAddress?.pincode,
      order?.shippingAddress?.country,
    ]
      .filter(Boolean)
      .join(', ') || '-';

  const logoInitials = (company.name || 'QH')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="inv-doc">
      <div className="inv-watermark inv-display">PAID</div>

      <div className="inv-header">
        <div>
          <div className="inv-brand">
            <div className="inv-logo inv-display">{logoInitials}</div>

            <div>
              <h1 className="inv-company-name inv-display">{company.name}</h1>
              <p className="inv-tagline">Premium Healthcare &amp; Lifestyle Store</p>
            </div>
          </div>

          <div className="inv-company-info">
            {company.address && <p>{company.address}</p>}
            {company.email && <p>Email: {company.email}</p>}
            {company.phone && <p>Phone: {company.phone}</p>}
            {company.gstin && <p>GSTIN: {company.gstin}</p>}
            {company.pan && <p>PAN: {company.pan}</p>}
          </div>
        </div>

        <div className="inv-title-wrap">
          <p className="inv-eyebrow">Tax Invoice</p>
          <div className="inv-title inv-display">Invoice</div>

          <div className="inv-badge">
            <span className="inv-badge-dot" />
            {String(paymentStatus).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="inv-info-grid">
        <div className="inv-card">
          <h3 className="inv-card-title">Bill To</h3>

          <div className="inv-card-body">
            <p className="inv-customer-name">{customer.name}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
            <p>{customerAddress}</p>
          </div>
        </div>

        <div className="inv-card">
          <h3 className="inv-card-title">Invoice Details</h3>

          <div className="inv-card-body">
            <InfoRowInline label="Invoice No" value={invoiceNumber} />
            <InfoRowInline label="Order ID" value={order?.orderId || invoice?.orderId || '-'} />
            <InfoRowInline label="Invoice Date" value={formatDate(invoice?.createdAt || new Date())} />
            <InfoRowInline label="Order Date" value={formatDate(order?.createdAt || order?.orderedAt)} />
            <InfoRowInline
              label="Payment Method"
              value={(order?.payment?.method || invoice?.paymentMethod || '-').toUpperCase()}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th className="inv-th" style={{ textAlign: 'left' }}>Item</th>
              <th className="inv-th" style={{ textAlign: 'center' }}>Qty</th>
              <th className="inv-th" style={{ textAlign: 'right' }}>Price</th>
              <th className="inv-th" style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="inv-td" style={{ textAlign: 'center', color: '#9aa2b1' }}>
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const productName =
                  item.name || item.product?.name || item.productName || 'Product';

                const sku = item.sku || item.product?.sku || item.variant?.sku || '';

                const variantName = item.variantName || item.variant?.name || '';

                const quantity = Number(item.quantity || 1);

                const price = Number(
                  item.price || item.product?.price || item.variant?.price || 0
                );

                const total = Number(item.total || item.lineTotal || quantity * price || 0);

                return (
                  <tr key={item._id || index}>
                    <td className="inv-td">
                      <p className="inv-item-name">{productName}</p>
                      {variantName && <p className="inv-small">Variant: {variantName}</p>}
                      {sku && <p className="inv-small">SKU: {sku}</p>}
                    </td>

                    <td className="inv-td" style={{ textAlign: 'center' }}>{quantity}</td>
                    <td className="inv-td" style={{ textAlign: 'right' }}>{formatCurrency(price)}</td>
                    <td className="inv-td" style={{ textAlign: 'right', fontWeight: 800, color: '#0b1220' }}>
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="inv-summary-wrap">
        <div className="inv-summary-card">
          <TotalRowInline label="Subtotal" value={totals.subtotal} />
          <TotalRowInline label="Discount" value={-(totals.discountAmount || 0)} />
          <TotalRowInline label="Shipping" value={totals.shippingCharge} />
          <TotalRowInline label={`GST (${totals.taxRate || 0}%)`} value={totals.taxAmount} />

          <div className="inv-divider" />

          <div className="inv-grand">
            <span className="inv-grand-label">Grand Total</span>
            <span className="inv-grand-value inv-display">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="inv-notes-grid">
        <div className="inv-note-box">
          <h4 className="inv-note-title">Notes</h4>
          <p className="inv-note-text">
            Thank you for shopping with {company.name}. For support, contact {company.email}.
          </p>
        </div>

        <div className="inv-note-box">
          <h4 className="inv-note-title">Declaration</h4>
          <p className="inv-note-text">
            This is a computer-generated invoice and does not require a physical signature.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="inv-footer">
        <ShieldCheck size={14} color="#9aa2b1" />
        <span>Invoice generated by {company.name} · {company.email}</span>
      </div>
    </div>
  );
}

function InfoRowInline({ label, value }) {
  return (
    <div className="inv-row">
      <span className="inv-row-label">{label}</span>
      <span className="inv-row-value">{value}</span>
    </div>
  );
}

function TotalRowInline({ label, value }) {
  return (
    <div className="inv-total-row">
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  );
}