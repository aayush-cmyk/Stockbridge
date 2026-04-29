import React from 'react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = order.price * order.quantity;
  const taxRate = 0.18; // 18% GST as placeholder
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal card animate-fade-in">
        <div className="invoice-header-actions no-print">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrint}>Print / Download PDF</button>
        </div>

        <div id="invoice-content" className="invoice-content">
          <div className="invoice-top">
            <div className="brand">
              <h2 style={{ color: 'var(--primary)', margin: 0 }}>StockBridge</h2>
              <p className="text-muted">B2B Inventory Visibility Platform</p>
            </div>
            <div className="invoice-meta">
              <h3>INVOICE</h3>
              <p><strong>Invoice #:</strong> {order.invoice_number || 'PENDING'}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: order.status === 'paid' ? '#10b981' : '#f59e0b' }}>{order.status}</span></p>
            </div>
          </div>

          <div className="invoice-address-grid">
            <div className="address-block">
              <p className="label">BILL FROM</p>
              <strong>{order.supplier_name}</strong>
              <p>{order.supplier_address || 'Address not provided'}</p>
              <p>Email: {order.supplier_email}</p>
              {order.supplier_gstin && <p>GSTIN: {order.supplier_gstin}</p>}
            </div>
            <div className="address-block">
              <p className="label">BILL TO</p>
              <strong>{order.retailer_name}</strong>
              <p>{order.retailer_address || 'Address not provided'}</p>
              <p>Email: {order.retailer_email}</p>
              {order.retailer_gstin && <p>GSTIN: {order.retailer_gstin}</p>}
            </div>
          </div>

          <div className="invoice-table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{order.product_name}</strong>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>B2B Order Ref: #{order.id}</p>
                  </td>
                  <td className="text-center">{order.quantity} {order.unit}s</td>
                  <td className="text-right">₹{order.price.toLocaleString()}</td>
                  <td className="text-right">₹{subtotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="invoice-footer">
            <p><strong>Payment Terms:</strong> Pre-paid via Razorpay</p>
            {order.razorpay_payment_id && (
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Transaction ID: {order.razorpay_payment_id}</p>
            )}
            <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
              <p className="text-muted">This is a computer-generated document. No signature is required.</p>
              <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.5rem' }}>Thank you for using StockBridge!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          overflow-y: auto;
        }
        .invoice-modal {
          background: white;
          width: 100%;
          max-width: 800px;
          color: #1e293b;
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .invoice-header-actions {
          padding: 1rem 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-radius: 12px 12px 0 0;
        }
        .invoice-content {
          padding: 3rem;
        }
        .invoice-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .invoice-meta {
          text-align: right;
        }
        .invoice-meta h3 {
          font-size: 2rem;
          margin: 0 0 1rem 0;
          color: #64748b;
        }
        .invoice-meta p {
          margin: 0.2rem 0;
        }
        .invoice-address-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }
        .address-block p.label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        .address-block p {
          margin: 0.2rem 0;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        .invoice-table th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #64748b;
          border-bottom: 2px solid #e2e8f0;
        }
        .invoice-table td {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .invoice-summary {
          margin-left: auto;
          width: 300px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }
        .summary-row.total {
          border-top: 2px solid #e2e8f0;
          margin-top: 1rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--primary);
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        @media print {
          .no-print { display: none !important; }
          .invoice-modal-overlay { position: absolute; background: white; padding: 0; }
          .invoice-modal { box-shadow: none; max-width: 100%; border: none; }
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
