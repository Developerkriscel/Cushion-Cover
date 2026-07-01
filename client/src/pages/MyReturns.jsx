import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, ImagePlus, Package, RotateCcw, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api.js";
import { formatCurrency } from "../utils/format.js";

const statusFlow = [
  "Requested",
  "Under Review",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "Received at Warehouse",
  "Refund Initiated",
  "Refunded"
];

const statusColors = {
  "Requested": "badge-warning",
  "Under Review": "badge-warning",
  "Approved": "badge-success",
  "Pickup Scheduled": "badge-info",
  "Picked Up": "badge-info",
  "Received at Warehouse": "badge-info",
  "Refund Initiated": "badge-info",
  "Refunded": "badge-success",
  "Rejected": "badge-danger"
};

const returnReasons = [
  "Damaged product received",
  "Wrong item received",
  "Product quality issue",
  "Product not as described",
  "Size or fit issue",
  "Changed my mind",
  "Other"
];

export default function MyReturns() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("my-returns");
  const [returns, setReturns] = useState([]);
  const [eligibleItems, setEligibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ orderId: "", productId: "", quantity: 1, returnReason: "", comments: "", images: [] });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReturns = () => {
    setLoading(true);
    api.get("/returns/my").then(({ data }) => setReturns(data)).catch(() => {}).finally(() => setLoading(false));
  };

  const loadEligible = () => {
    api.get("/returns/eligible").then(({ data }) => setEligibleItems(data)).catch(() => {});
  };

  useEffect(() => {
    loadReturns();
    loadEligible();
  }, []);

  const selectProduct = (item) => {
    setSelectedProduct(item);
    setForm({
      orderId: item.orderId,
      productId: item.product._id || item.product,
      quantity: 1,
      returnReason: "",
      comments: "",
      images: []
    });
  };

  const cancelSelection = () => {
    setSelectedProduct(null);
    setForm({ orderId: "", productId: "", quantity: 1, returnReason: "", comments: "", images: [] });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then((results) => {
      setForm((f) => ({ ...f, images: [...f.images, ...results] }));
    });
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    if (!form.returnReason) return toast.error("Please select a return reason");
    setSubmitting(true);
    try {
      await api.post("/returns", form);
      toast.success("Return request submitted successfully");
      cancelSelection();
      loadReturns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelReturn = async (id) => {
    if (!window.confirm("Cancel this return request?")) return;
    try {
      await api.put(`/returns/${id}/cancel`);
      toast.success("Return request cancelled");
      loadReturns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel return");
    }
  };

  const getStatusIndex = (status) => statusFlow.indexOf(status);

  return (
    <>
      <Helmet>
        <title>My Returns & Refunds | Elegant Home Decor</title>
      </Helmet>
      <section className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          <button className={activeTab === "my-returns" ? "active" : ""} onClick={() => setActiveTab("my-returns")}>
            <RotateCcw size={18} />
            My Returns
          </button>
          <button className={activeTab === "new-return" ? "active" : ""} onClick={() => { setActiveTab("new-return"); loadEligible(); }}>
            <Package size={18} />
            Request Return
          </button>
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </aside>
        <div className="dashboard-content">
          {activeTab === "my-returns" && (
            <section className="dashboard-panel">
              <h1>My Returns & Refunds</h1>
              {loading ? (
                <div className="empty-state">Loading...</div>
              ) : returns.length === 0 ? (
                <div className="empty-state">
                  <RotateCcw size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <p>No return requests yet.</p>
                </div>
              ) : (
                <div className="returns-list">
                  {returns.map((ret) => {
                    const isExpanded = expandedId === ret._id;
                    const statusIdx = getStatusIndex(ret.status);
                    const isCancellable = ["Requested", "Under Review"].includes(ret.status);

                    return (
                      <div className="return-card" key={ret._id}>
                        <div className="return-card-header" onClick={() => setExpandedId(isExpanded ? null : ret._id)}>
                          <div className="return-card-summary">
                            <img src={ret.product?.images?.[0]?.url || ""} alt="" className="return-product-thumb" />
                            <div>
                              <strong>{ret.product?.name || "Product"}</strong>
                              <div className="return-meta">
                                <span>Return ID: {ret.returnId}</span>
                                <span>Order: {ret.order?.orderNumber}</span>
                                <span>Qty: {ret.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="return-card-right">
                            <span className={`status-badge ${statusColors[ret.status]}`}>{ret.status}</span>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="return-card-body">
                            <div className="return-status-track">
                              {statusFlow.map((s, i) => (
                                <div key={s} className={`status-step ${i <= statusIdx ? "completed" : ""} ${s === ret.status ? "current" : ""}`}>
                                  <div className="status-dot" />
                                  <span className="status-label">{s}</span>
                                </div>
                              ))}
                            </div>

                            <div className="return-details-grid">
                              <div>
                                <h4>Return Details</h4>
                                <p><span>Reason:</span> {ret.returnReason}</p>
                                {ret.comments && <p><span>Comments:</span> {ret.comments}</p>}
                                <p><span>Requested on:</span> {new Date(ret.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <h4>Refund Info</h4>
                                {ret.refund ? (
                                  <>
                                    <p><span>Amount:</span> {formatCurrency(ret.refund.refundAmount)}</p>
                                    <p><span>Method:</span> {ret.refund.refundMethod}</p>
                                    <p><span>Status:</span> <span className={`status-badge ${ret.refund.refundStatus === "Completed" ? "badge-success" : "badge-warning"}`}>{ret.refund.refundStatus}</span></p>
                                    {ret.refund.completedAt && <p><span>Completed:</span> {new Date(ret.refund.completedAt).toLocaleDateString()}</p>}
                                  </>
                                ) : (
                                  <p className="no-refund">Refund will be processed after return is approved.</p>
                                )}
                              </div>
                            </div>

                            {ret.images?.length > 0 && (
                              <div className="return-images">
                                <h4>Uploaded Images</h4>
                                <div className="image-grid">
                                  {ret.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className="return-image" />
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="return-actions">
                              {isCancellable && (
                                <button className="button ghost" onClick={() => cancelReturn(ret._id)}>Cancel Request</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === "new-return" && (
            <section className="dashboard-panel">
              <h1>Request a Return</h1>

              {!selectedProduct ? (
                <>
                  {eligibleItems.length === 0 ? (
                    <div className="empty-state">
                      <Package size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                      <p>No products eligible for return. Only delivered orders within the return window can be returned.</p>
                    </div>
                  ) : (
                    <div className="eligible-list">
                      <p className="eligible-hint">Select a product to return:</p>
                      {eligibleItems.map((item, idx) => (
                        <div className="eligible-card" key={idx} onClick={() => selectProduct(item)}>
                          <img src={item.product?.images?.[0]?.url || ""} alt="" className="eligible-thumb" />
                          <div className="eligible-info">
                            <strong>{item.product?.name}</strong>
                            <span>Order: {item.orderNumber}</span>
                            <span>Qty: {item.returnableQty} available | Days left: {item.daysLeft}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <form className="return-form" onSubmit={submitReturn}>
                  <div className="return-form-header">
                    <button type="button" className="icon-button" onClick={cancelSelection}><X size={20} /></button>
                    <h3>Return: {selectedProduct.product?.name}</h3>
                  </div>

                  <div className="form-field">
                    <label>Quantity to Return</label>
                    <select value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}>
                      {Array.from({ length: selectedProduct.returnableQty }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Reason for Return</label>
                    <select value={form.returnReason} onChange={(e) => setForm((f) => ({ ...f, returnReason: e.target.value }))} required>
                      <option value="">Select a reason</option>
                      {returnReasons.map((reason) => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Additional Comments (optional)</label>
                    <textarea rows={3} value={form.comments} onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Tell us more about the issue" />
                  </div>

                  <div className="form-field">
                    <label>Upload Images (optional)</label>
                    <div className="image-upload-area">
                      <label className="upload-btn">
                        <ImagePlus size={20} />
                        Add Images
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
                      </label>
                      {form.images.length > 0 && (
                        <div className="uploaded-images">
                          {form.images.map((img, i) => (
                            <div className="uploaded-image" key={i}>
                              <img src={img} alt="" />
                              <button type="button" className="remove-image-btn" onClick={() => removeImage(i)}><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="button-row">
                    <button className="button primary" type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Return Request"}
                    </button>
                    <button className="button ghost" type="button" onClick={cancelSelection}>Cancel</button>
                  </div>
                </form>
              )}
            </section>
          )}
        </div>
      </section>
    </>
  );
}
