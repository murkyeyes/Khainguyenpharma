import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Cart, Collection, Menu, Page, Product } from './types';

const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'https://khainguyenpharma.onrender.com';

async function apiFetch<T>({
  endpoint,
  method = 'GET',
  body,
  cache = 'no-store',
  tags
}: {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  try {
    const url = `${API_URL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      cache,
      // Truyền tags để Next.js có thể revalidate cache theo tag
      ...(tags && tags.length > 0 ? { next: { tags } } : {}),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Fix image URLs that might point to localhost
    const fixedData = JSON.parse(JSON.stringify(data).replace(
      /http:\/\/localhost:3001/g, 
      'https://khainguyenpharma.onrender.com'
    ));

    return fixedData;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Product Functions
export async function getProducts({
  query,
  sortKey,
  reverse
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (sortKey) params.append('sortKey', sortKey);
  if (reverse !== undefined) params.append('reverse', String(reverse));
  
  // Bypass cache
  params.append('v', '2');

  const endpoint = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
  try {
    const data = await apiFetch<{ products: Product[] }>({ endpoint });
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const data = await apiFetch<{ product: Product }>({ 
      endpoint: `/api/products/${handle}`,
      cache: 'no-store'
    });
    return data.product;
  } catch (error) {
    return undefined;
  }
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  try {
    const data = await apiFetch<{ products: Product[] }>({ 
      endpoint: `/api/products/${productId}/recommendations` 
    });
    return data.products;
  } catch (error) {
    return [];
  }
}

// Collection Functions
export async function getCollections(): Promise<Collection[]> {
  try {
    const data = await apiFetch<{ collections: Collection[] }>({
      endpoint: '/api/collections',
      cache: 'force-cache',
      tags: [TAGS.collections]
    });
    return data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  try {
    const data = await apiFetch<{ collection: Collection }>({ 
      endpoint: `/api/collections/${handle}` 
    });
    return data.collection;
  } catch (error) {
    return undefined;
  }
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse
}: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (sortKey) params.append('sortKey', sortKey);
  if (reverse !== undefined) params.append('reverse', String(reverse));

  const endpoint = `/api/collections/${collection}/products${params.toString() ? `?${params.toString()}` : ''}`;
  try {
    const data = await apiFetch<{ products: Product[] }>({ endpoint });
    return data.products || [];
  } catch (error) {
    console.error(`Error fetching products for collection ${collection}:`, error);
    return [];
  }
}

// Cart Functions
export async function createCart(): Promise<Cart> {
  const data = await apiFetch<{ cart: Cart }>({
    endpoint: '/api/cart',
    method: 'POST',
    cache: 'no-store'
  });
  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await apiFetch<{ cart: Cart }>({
    endpoint: `/api/cart/${cartId}/items`,
    method: 'POST',
    body: lines[0], // API expects single item
    cache: 'no-store'
  });
  
  revalidateTag(TAGS.cart);
  return data.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await apiFetch<{ cart: Cart }>({
    endpoint: `/api/cart/${cartId}/items/${lineIds[0]}`,
    method: 'DELETE',
    cache: 'no-store'
  });
  
  revalidateTag(TAGS.cart);
  return data.cart;
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await apiFetch<{ cart: Cart }>({
    endpoint: `/api/cart/${cartId}/items`,
    method: 'PUT',
    body: { lines },
    cache: 'no-store'
  });
  
  revalidateTag(TAGS.cart);
  return data.cart;
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  try {
    const data = await apiFetch<{ cart: Cart }>({
      endpoint: `/api/cart/${cartId}`,
      cache: 'no-store'
    });
    return data.cart;
  } catch (error) {
    return undefined;
  }
}

// Page Functions
export async function getPage(handle: string): Promise<Page | undefined> {
  try {
    const data = await apiFetch<{ page: Page }>({ 
      endpoint: `/api/pages/${handle}` 
    });
    return data.page;
  } catch (error) {
    console.error(`Error fetching page ${handle}:`, error);
    return undefined;
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const data = await apiFetch<{ pages: Page[] }>({ 
      endpoint: '/api/pages' 
    });
    return data.pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Menu Functions
export async function getMenu(handle: string): Promise<Menu[]> {
  try {
    const data = await apiFetch<{ menu: Menu[] }>({
      endpoint: `/api/menu/${handle}`,
      cache: 'force-cache',
      tags: [TAGS.menu]
    });
    return data.menu || [];
  } catch (error) {
    console.error(`Error fetching menu ${handle}:`, error);
    return [];
  }
}

// Revalidation Handler
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  
  const topic = req.headers.get('x-api-topic');
  const secret = req.headers.get('x-api-secret');

  if (secret !== process.env.API_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!topic) {
    return NextResponse.json({ status: 400 });
  }

  if (collectionWebhooks.includes(topic)) {
    revalidateTag(TAGS.collections);
  }

  if (productWebhooks.includes(topic)) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
