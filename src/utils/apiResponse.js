export function unwrapApiData(payload) {
  if (!payload || typeof payload !== "object") return payload;

  if (payload.success !== undefined && payload.data !== undefined) {
    return payload.data;
  }

  return payload;
}

export function unwrapProductDetail(payload) {
  const data = unwrapApiData(payload) || {};

  return {
    product: data.product || null,
    variants: Array.isArray(data.variants) ? data.variants : [],
  };
}
