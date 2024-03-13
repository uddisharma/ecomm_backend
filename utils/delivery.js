export function findShipmentComapanyWithLowCharge(data) {
  if (!data || data.length === 0) {
    return null;
  }
  let minCharge = Number.POSITIVE_INFINITY;
  let maxCharge = Number.NEGATIVE_INFINITY;
  let minChargeItem = null;
  let maxChargeItem = null;
  for (const item of data) {
    const freightCharge = item.freight_charges;

    if (freightCharge < minCharge) {
      minCharge = freightCharge;
      minChargeItem = item;
    }

    if (freightCharge > maxCharge) {
      maxCharge = freightCharge;
      maxChargeItem = item;
    }
  }
  return {
    minFreightChargeItem: minChargeItem,
    maxFreightChargeItem: maxChargeItem,
  };
}
