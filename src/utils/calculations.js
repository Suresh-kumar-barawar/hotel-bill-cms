const roundAmount = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const nonNegativeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const calculateBill = ({
  items = [],
  gstRate = 5,
  discountRate = 0,
}) => {
  const calculatedItems = items.map((item, index) => {
    const quantity = nonNegativeNumber(item.quantity);
    const unitPrice = nonNegativeNumber(item.unitPrice);

    return {
      ...item,
      sno: index + 1,
      amount: roundAmount(quantity * unitPrice),
    };
  });

  const subtotal = roundAmount(
    calculatedItems.reduce((sum, item) => sum + item.amount, 0),
  );
  const discountPercent = Math.min(100, nonNegativeNumber(discountRate));
  const discount = roundAmount((subtotal * discountPercent) / 100);
  const taxableAmount = roundAmount(Math.max(0, subtotal - discount));
  const taxPercent = nonNegativeNumber(gstRate);
  const gst = roundAmount((taxableAmount * taxPercent) / 100);
  const total = roundAmount(taxableAmount + gst);

  return {
    items: calculatedItems,
    subtotal,
    discount,
    taxableAmount,
    gst,
    total,
  };
};
