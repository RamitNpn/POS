// shared helper, e.g. in a utils file
export function calculateOrderTotal(
  subtotal: number,
  tax: number,
  discount = 0,
) {
  const discountAmount = Number(
    (((subtotal + tax) * discount) / 100).toFixed(2),
  );
  return Number((subtotal + tax - discountAmount).toFixed(2));
}
