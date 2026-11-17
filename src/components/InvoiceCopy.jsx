import logoAsset from "../assets/swaad-logo.jpeg";
import qrAsset from "../assets/upi-qr.jpeg";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
};

function InvoiceCopy({ billData, totals, invoiceNumber, copyLabel }) {
  return (
    <div className="copy-slot">
      <article className="invoice" aria-label={`${copyLabel} hotel bill preview`}>
        <span className="copy-label">{copyLabel}</span>
        <header className="invoice-header">
          <div className="devotional-row">
            <p className="devotional-line">श्री गणेशाय नम:</p>
            <p className="devotional-line">श्री भैरवे नम:</p>
          </div>
          <div className="invoice-mark">
            <img className="invoice-logo" src={logoAsset} alt="Swaad Bhawan logo" />
          </div>
          <div className="business-title">
            <h2>SWAAD BHAWAN RESTAURANT</h2>
          </div>
          <div className="business-meta-row">
            <p className="business-meta">
              GST:{billData.gstin || " ____________________"}
            </p>
            <p className="business-meta">
              Fssai: {billData.fssai || "____________________"}
            </p>
          </div>
        </header>

        <div className="invoice-rule" />

        <section className="invoice-details">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <p className="customer-name">{billData.customerName}</p>
            <p>Mobile: {billData.mobile}</p>
            <p className="customer-address">Address: {billData.address}</p>
          </div>
          <dl className="invoice-metadata">
            <div>
              <dt>Invoice No:</dt>
              <dd>{invoiceNumber}</dd>
            </div>
            <div>
              <dt>Date:</dt>
              <dd>{formatDate(billData.invoiceDate)}</dd>
            </div>
          </dl>
        </section>

        <table className="invoice-table">
          <thead>
            <tr>
              <th className="sno-column">SNO.</th>
              <th>Description</th>
              <th className="number-column">Qty. Day/Night</th>
              <th className="number-column">Unit price</th>
              <th className="number-column">Sub-Total</th>
            </tr>
          </thead>
          <tbody>
            {totals.items.map((item) => {
              const hasItemDetails =
                item.description || item.quantity || item.unitPrice;

              return (
                <tr key={item.id}>
                  <td className="centered">{hasItemDetails ? item.sno : ""}</td>
                  <td>{item.description}</td>
                  <td className="centered">{item.quantity}</td>
                  <td className="numeric">
                    {item.unitPrice === "" ? "" : money(Number(item.unitPrice) || 0)}
                  </td>
                  <td className="numeric">
                    {hasItemDetails ? money(item.amount) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <section className="invoice-bottom">
          <div className="payment-block">
            <p className="upi-id">UPI ID: q154351384@YBL</p>
            <div className="qr-placeholder">
              <img src={qrAsset} alt="UPI payment QR code" />
            </div>
            <p className="upi-prompt">UPI Scan and Pay</p>
          </div>
          <div className="totals-block">
            <div>
              <span>Sub-Total</span>
              <strong>{money(totals.subtotal)}</strong>
            </div>
            <div>
              <span>Discount ({Number(billData.discountRate) || 0}%)</span>
              <strong>-{money(totals.discount)}</strong>
            </div>
            <div>
              <span>Tax {Number(billData.gstRate) || 0}%</span>
              <strong>{money(totals.gst)}</strong>
            </div>
            <div className="grand-total">
              <span>TOTAL</span>
              <strong>{money(totals.total)}</strong>
            </div>
            <div className="signature">Authority Signature</div>
          </div>
        </section>

        <p className="thanks-message">Thank you for Stay with us Visit Again</p>

        <footer className="invoice-footer">
          <span className="footer-mobile">
            <strong>Mobile:</strong> 63506-30325
          </span>
          <span className="footer-address">
            <strong>Address:</strong> Shop 2 Manvi enclave, Suratgarh Hanumangarh
            Bypass, Sri Ganganagar (Raj.) 335001
          </span>
        </footer>
      </article>
    </div>
  );
}

export default InvoiceCopy;
