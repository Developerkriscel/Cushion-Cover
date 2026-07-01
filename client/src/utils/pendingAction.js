export const savePendingAction = ({ type, product, options }) => {
  localStorage.setItem("redirectAfterLogin", window.location.pathname);
  localStorage.setItem(
    "pendingAction",
    JSON.stringify({
      type,
      productId: product?._id,
      product,
      options
    })
  );
};

export const clearPendingAction = () => {
  localStorage.removeItem("redirectAfterLogin");
  localStorage.removeItem("pendingAction");
};
