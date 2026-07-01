const tone = {
  Processing: "badge-warning",
  Confirmed: "badge-info",
  Packed: "badge-info",
  Shipped: "badge-info",
  Delivered: "badge-success",
  Cancelled: "badge-danger"
};

export default function OrderStatusBadge({ status = "Processing" }) {
  return <span className={`status-badge ${tone[status] || "badge-info"}`}>{status}</span>;
}
