'use client';

import { useEffect, useState } from 'react';

export function usePublicOrigin(): string {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(typeof window !== 'undefined' ? window.location.origin : '');
  }, []);

  return origin;
}

export function parentPortalUrl(origin: string, slug: string): string {
  const pathSlug = slug.replace(/^\/+/, '');
  if (!pathSlug) return origin || '/';
  if (!origin) return `/${pathSlug}`;
  return `${origin.replace(/\/$/, '')}/${pathSlug}`;
}

export function portalDisplayHostPath(origin: string, slug: string): string {
  const pathSlug = slug.replace(/^\/+/, '');
  if (!origin) return pathSlug ? pathSlug : '';
  try {
    const host = new URL(origin).host;
    return pathSlug ? `${host}/${pathSlug}` : host;
  } catch {
    return pathSlug ? `${origin.replace(/^https?:\/\//, '').replace(/\/$/, '')}/${pathSlug}` : '';
  }
}
