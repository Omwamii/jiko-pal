import type { Router } from 'expo-router';

type UserRole = 'client' | 'vendor' | string;

type DeepLinkTarget = {
  pathname: string;
  params: Record<string, string>;
};

function dashboardPathForRole(role?: UserRole | null) {
  return role === 'vendor' ? '/vendor-dashboard' : '/(tabs)';
}

const KNOWN_PATHNAMES = new Set<string>([
  '/',
  '/index',
  '/welcome',
  '/account-type',
  '/login',
  '/signup',
  '/vendor-dashboard',
  '/vendor-orders',
  '/vendor-order-detail',
  '/vendor-mark-delivered',
  '/vendor-delivery-success',
  '/vendor-reviews',
  '/vendor-subscribers',
  '/vendor-customer-detail',
  '/vendor-customer-chat',
  '/member-chat',
  '/vendor-monitor-detail',
  '/vendor-settings',
  '/vendor-business-information',
  '/vendor-password-security',
  '/vendor-analytics',
  '/vendor-help',
  '/vendor-notifications',
  '/client-orders',
  '/client-order-detail',
  '/vendor-chat',
  '/monitors',
  '/my-circle',
  '/my-circle/index',
  '/my-circle/create',
  '/my-circle/success',
  '/my-circle/delete-success',
  '/my-circle/member',
  '/my-circle/cylinder',
  '/my-circle/circle',
  '/my-circle/invite',
  '/add-monitor',
  '/add-monitor/index',
  '/add-monitor/existing',
  '/add-monitor/scan',
  '/add-monitor/success',
  '/add-monitor/wifi-credentials',
  '/add-monitor/details',
  '/add-monitor/wifi-setup',
  '/invite-users',
  '/invite-users/index',
  '/invite-users/success',
  '/invite-users/sms',
  '/invite-users/email',
  '/invite-users/method',
  '/invite/[code]',
  '/(tabs)',
  '/(tabs)/notifications',
  '/(tabs)/recent-activity',
  '/(tabs)/vendors',
  '/(tabs)/vendors/index',
  '/(tabs)/vendors/detail',
  '/(tabs)/vendors/catalogue-select',
  '/(tabs)/vendors/refill-date',
  '/(tabs)/vendors/refill-select',
  '/(tabs)/vendors/refill-success',
  '/(tabs)/vendors/reviews',
  '/(tabs)/help',
  '/(tabs)/help/index',
  '/(tabs)/profile',
  '/(tabs)/profile/index',
  '/(tabs)/profile/edit',
  '/(tabs)/profile/account-actions',
  '/(tabs)/profile/preferences',
  '/(tabs)/profile/password',
]);

function toInternalPathname(pathname: string) {
  if (!pathname) return '';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash.replace(/\/{2,}/g, '/');
}

function parseParamsFromSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) params[key] = value;
  return params;
}

export function parseDeepLinkTarget(urlOrPath: string | null | undefined): DeepLinkTarget | null {
  const raw = (urlOrPath || '').trim();
  if (!raw) return null;

  // Already an internal path (e.g. "/vendor-order-detail?orderId=...")
  if (raw.startsWith('/')) {
    const u = new URL(raw, 'https://local/');
    return { pathname: toInternalPathname(u.pathname), params: parseParamsFromSearchParams(u.searchParams) };
  }

  // Full deep link (e.g. "myapp://vendor-order-detail?orderId=...")
  if (raw.includes('://')) {
    try {
      const u = new URL(raw);
      const route = `${u.host || ''}${u.pathname || ''}`.replace(/^\/+/, '');
      return { pathname: toInternalPathname(route), params: parseParamsFromSearchParams(u.searchParams) };
    } catch {
      return null;
    }
  }

  // Route without scheme (e.g. "vendor-order-detail?orderId=...")
  const u = new URL(`https://local/${raw.replace(/^\/+/, '')}`);
  return { pathname: toInternalPathname(u.pathname), params: parseParamsFromSearchParams(u.searchParams) };
}

export function getDashboardPathForRole(role?: UserRole | null) {
  return dashboardPathForRole(role);
}

export function isKnownInternalPathname(pathname: string) {
  return KNOWN_PATHNAMES.has(toInternalPathname(pathname));
}

export function toHrefString(target: DeepLinkTarget) {
  const qs = new URLSearchParams(target.params).toString();
  return qs ? `${target.pathname}?${qs}` : target.pathname;
}

export function navigateFromNotificationLink(opts: {
  router: Router;
  urlOrPath: string | null | undefined;
  isAuthenticated: boolean;
  role?: UserRole | null;
}) {
  const target = parseDeepLinkTarget(opts.urlOrPath);
  const dashboard = dashboardPathForRole(opts.role);

  if (!target || !isKnownInternalPathname(target.pathname)) {
    if (opts.isAuthenticated) {
      opts.router.replace(dashboard as any);
      return false;
    }
    opts.router.replace('/login' as any);
    return false;
  }

  const href = { pathname: target.pathname, params: target.params } as any;
  if (!opts.isAuthenticated) {
    opts.router.replace({ pathname: '/login', params: { redirectTo: toHrefString(target) } } as any);
    return true;
  }

  opts.router.push(href);
  return true;
}
