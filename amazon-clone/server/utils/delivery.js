function computeDeliveryEstimate(stock) {
  const today = new Date();
  const minDays = stock > 20 ? 2 : stock > 0 ? 5 : 10;
  const maxDays = minDays + 3;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + minDays);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + maxDays);

  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return `${fmt(startDate)} - ${fmt(endDate)}`;
}

module.exports = { computeDeliveryEstimate };