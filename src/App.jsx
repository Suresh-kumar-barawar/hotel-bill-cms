import { useState } from "react";
import { calculateBill } from "./utils/calculations.js";
import InvoiceCopy from "./components/InvoiceCopy.jsx";
import "./App.css";

const today = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const initialBill = {
  invoiceDate: today(),
  invoiceSuffix: "",
  gstin: "08EFDPK8886Q1Z9",
  fssai: "22225022000276",
  customerName: "",
  mobile: "",
  address: "",
  items: [{ id: 1, description: "", quantity: "", unitPrice: "" }],
  discountRate: 0,
  gstRate: 5,
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

function App() {
  const [billData, setBillData] = useState(initialBill);
  const totals = calculateBill(billData);
  const [invoiceYear, invoiceMonth, invoiceDay] = (billData.invoiceDate || "").split("-");
  const invoiceDateCode =
    invoiceYear && invoiceMonth && invoiceDay
      ? `${invoiceDay}${invoiceMonth}${invoiceYear}`
      : "DDMMYYYY";
  const invoiceNumber = `SBR${invoiceDateCode}-${billData.invoiceSuffix}`;

  const updateField = (field, value) => {
    setBillData((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (itemId, field, value) => {
    setBillData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setBillData((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: Math.max(0, ...current.items.map((item) => item.id)) + 1,
          description: "",
          quantity: "",
          unitPrice: "",
        },
      ],
    }));
  };

  const removeItem = (itemId) => {
    setBillData((current) => ({
      ...current,
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== itemId)
          : current.items,
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <p className="eyebrow">Hotel Bill</p>
          <h1>Swaad Bhawan Restaurant</h1>
          <p className="header-subtitle">
            Enter bill details, review the live preview, and save it as a PDF.
          </p>
        </div>
        <button className="primary-button header-print-button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </header>

      <main className="workspace">
        <section className="preview-panel" aria-labelledby="preview-title">
          <div className="panel-heading preview-heading">
            <div>
              <h2 id="preview-title">Bill preview</h2>
              <p>Updates automatically as you edit the form.</p>
            </div>
            <button
              className="primary-button preview-print-button"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
          </div>

          <div className="invoice-scroll">
            <div className="invoice-sheet">
              <InvoiceCopy
                billData={billData}
                totals={totals}
                invoiceNumber={invoiceNumber}
                copyLabel="Customer Copy"
              />
              <InvoiceCopy
                billData={billData}
                totals={totals}
                invoiceNumber={invoiceNumber}
                copyLabel="Office Copy"
              />
            </div>
          </div>
        </section>

        <section className="form-panel" aria-labelledby="form-title">
          <div className="panel-heading">
            <div>
              <h2 id="form-title">Bill details</h2>
              <p>Complete the fields below to prepare a bill.</p>
            </div>
          </div>

          <form onSubmit={(event) => event.preventDefault()}>
            <fieldset className="form-section">
              <legend>Invoice information</legend>
              <div className="field-grid">
                <label className="form-field">
                  <span>Invoice date</span>
                  <input
                    type="date"
                    value={billData.invoiceDate}
                    onChange={(event) => updateField("invoiceDate", event.target.value)}
                  />
                </label>
                <label className="form-field">
                  <span>Invoice number suffix</span>
                  <input
                    type="text"
                    value={billData.invoiceSuffix}
                    onChange={(event) => updateField("invoiceSuffix", event.target.value)}
                    placeholder="e.g. 001"
                    maxLength={20}
                  />
                  <small>Generated number: {invoiceNumber}</small>
                </label>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Restaurant information</legend>
              <div className="field-grid">
                <label className="form-field">
                  <span>GSTIN</span>
                  <input
                    type="text"
                    value={billData.gstin}
                    onChange={(event) => updateField("gstin", event.target.value)}
                    placeholder="GSTIN"
                  />
                </label>
                <label className="form-field">
                  <span>FSSAI</span>
                  <input
                    type="text"
                    value={billData.fssai}
                    onChange={(event) => updateField("fssai", event.target.value)}
                    placeholder="FSSAI"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Customer information</legend>
              <label className="form-field">
                <span>Customer name</span>
                <input
                  type="text"
                  value={billData.customerName}
                  onChange={(event) => updateField("customerName", event.target.value)}
                  placeholder="Name on the bill"
                />
              </label>
              <div className="field-grid">
                <label className="form-field">
                  <span>Mobile number</span>
                  <input
                    type="tel"
                    value={billData.mobile}
                    onChange={(event) => updateField("mobile", event.target.value)}
                    placeholder="Mobile number"
                  />
                </label>
                <label className="form-field">
                  <span>Address</span>
                  <input
                    type="text"
                    value={billData.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Customer address"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Room / service charges</legend>
              <div className="items-list">
                {billData.items.map((item, index) => (
                  <div className="item-editor" key={item.id}>
                    <div className="item-editor-heading">
                      <strong>Item {index + 1}</strong>
                      {billData.items.length > 1 && (
                        <button
                          className="text-button remove-button"
                          type="button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <label className="form-field">
                      <span>Description / room number</span>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, "description", event.target.value)
                        }
                        placeholder="e.g. Room No. 101"
                      />
                    </label>
                    <div className="field-grid item-numbers">
                      <label className="form-field">
                        <span>Qty. day/night</span>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.id, "quantity", event.target.value)
                          }
                        />
                      </label>
                      <label className="form-field">
                        <span>Unit price (₹)</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(item.id, "unitPrice", event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <p className="item-total">
                      Line total <strong>{money(totals.items[index].amount)}</strong>
                    </p>
                  </div>
                ))}
              </div>
              <button className="secondary-button add-item-button" type="button" onClick={addItem}>
                + Add another item
              </button>
            </fieldset>

            <fieldset className="form-section">
              <legend>Discount &amp; tax</legend>
              <div className="field-grid">
                <label className="form-field">
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={billData.discountRate}
                    onChange={(event) => updateField("discountRate", event.target.value)}
                  />
                </label>
                <label className="form-field">
                  <span>Tax (%)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={billData.gstRate}
                    onChange={(event) => updateField("gstRate", event.target.value)}
                  />
                </label>
              </div>
              <p className="calculation-note">
                Tax defaults to 5%. Discount is deducted before tax.
              </p>
              <div className="form-total">
                <span>Bill total</span>
                <strong>{money(totals.total)}</strong>
              </div>
            </fieldset>
          </form>

          <button className="primary-button form-print-button" onClick={() => window.print()}>
            Print / Save PDF
          </button>
          <p className="print-hint">
            In the print dialog, choose “Save as PDF” to download the bill.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
