// same rules: ₹20 base + ₹5/km beyond 2km, free above ₹500
export function calculateDelivery(totalAmount, distanceKm){
  if (totalAmount >= 500) return 0
  const base = 20
  const extra = Math.max(0, distanceKm - 2) * 5
  return base + extra
}
