const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fetch helper
async function apiFetch(endpoint, options = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache || 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Products
export async function getProducts({ query, sortKey, reverse } = {}) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (sortKey) params.append('sortKey', sortKey);
  if (reverse !== undefined) params.append('reverse', String(reverse));

  const endpoint = `/api/products${params.toString() ? `?${params}` : ''}`;
  const data = await apiFetch(endpoint);
  return data.products || [];
}

export async function getProduct(handle) {
  try {
    const data = await apiFetch(`/api/products/${handle}`);
    return data.product;
  } catch (error) {
    return undefined;
  }
}

export async function getProductRecommendations(productId) {
  try {
    const data = await apiFetch(`/api/products/${productId}/recommendations`);
    return data.products || [];
  } catch (error) {
    return [];
  }
}

// Collections
export async function getCollections() {
  const data = await apiFetch('/api/collections');
  return data.collections || [];
}

export async function getCollection(handle) {
  try {
    const data = await apiFetch(`/api/collections/${handle}`);
    return data.collection;
  } catch (error) {
    return undefined;
  }
}

export async function getCollectionProducts({ collection, sortKey, reverse } = {}) {
  const params = new URLSearchParams();
  if (sortKey) params.append('sortKey', sortKey);
  if (reverse !== undefined) params.append('reverse', String(reverse));

  const endpoint = `/api/collections/${collection}/products${params.toString() ? `?${params}` : ''}`;
  const data = await apiFetch(endpoint);
  return data.products || [];
}

// Cart
export async function createCart() {
  const data = await apiFetch('/api/cart', {
    method: 'POST',
    cache: 'no-store'
  });
  return data.cart;
}

export async function getCart(cartId) {
  if (!cartId) return undefined;

  try {
    const data = await apiFetch(`/api/cart/${cartId}`, {
      cache: 'no-store'
    });
    return data.cart;
  } catch (error) {
    return undefined;
  }
}

export async function addToCart(cartId, lines) {
  const data = await apiFetch(`/api/cart/${cartId}/items`, {
    method: 'POST',
    body: lines[0],
    cache: 'no-store'
  });
  return data.cart;
}

export async function removeFromCart(cartId, lineIds) {
  const data = await apiFetch(`/api/cart/${cartId}/items/${lineIds[0]}`, {
    method: 'DELETE',
    cache: 'no-store'
  });
  return data.cart;
}

export async function updateCart(cartId, lines) {
  const data = await apiFetch(`/api/cart/${cartId}/items`, {
    method: 'PUT',
    body: { lines },
    cache: 'no-store'
  });
  return data.cart;
}

// Pages
export async function getPage(handle) {
  const data = await apiFetch(`/api/pages/${handle}`);
  return data.page;
}

export async function getPages() {
  const data = await apiFetch('/api/pages');
  return data.pages || [];
}

// Menu
export async function getMenu(handle) {
  const data = await apiFetch(`/api/menu/${handle}`);
  return data.menu || [];
}

// Revalidation
export async function revalidate(req) {
  const { revalidateTag } = await import('next/cache');
  const topic = req.headers.get('x-api-topic');
  const secret = req.headers.get('x-api-secret');

  if (secret !== process.env.API_REVALIDATION_SECRET) {
    return new Response(JSON.stringify({ status: 401 }), { status: 401 });
  }

  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];

  if (collectionWebhooks.includes(topic)) {
    revalidateTag('collections');
  }
  if (productWebhooks.includes(topic)) {
    revalidateTag('products');
  }

  return new Response(JSON.stringify({ status: 200, revalidated: true }), { status: 200 });
}
