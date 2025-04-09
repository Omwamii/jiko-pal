/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/circles` | `/circles`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/app-info`; params?: Router.UnknownInputParams; } | { pathname: `/circle/create`; params?: Router.UnknownInputParams; } | { pathname: `/circle/join`; params?: Router.UnknownInputParams; } | { pathname: `/cylinder/pair`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-avatar`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-password`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-profile-name`; params?: Router.UnknownInputParams; } | { pathname: `/profile/create`; params?: Router.UnknownInputParams; } | { pathname: `/profile/delete`; params?: Router.UnknownInputParams; } | { pathname: `/settings/account`; params?: Router.UnknownInputParams; } | { pathname: `/settings/notifications`; params?: Router.UnknownInputParams; } | { pathname: `/settings/privacy-policy`; params?: Router.UnknownInputParams; } | { pathname: `/signup`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } } | { pathname: `/circle/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/edit/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/delete/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/leave/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/cylinder/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/circles` | `/circles`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `/app-info`; params?: Router.UnknownOutputParams; } | { pathname: `/circle/create`; params?: Router.UnknownOutputParams; } | { pathname: `/circle/join`; params?: Router.UnknownOutputParams; } | { pathname: `/cylinder/pair`; params?: Router.UnknownOutputParams; } | { pathname: `/login`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/change-avatar`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/change-password`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/change-profile-name`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/create`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/delete`; params?: Router.UnknownOutputParams; } | { pathname: `/settings/account`; params?: Router.UnknownOutputParams; } | { pathname: `/settings/notifications`; params?: Router.UnknownOutputParams; } | { pathname: `/settings/privacy-policy`; params?: Router.UnknownOutputParams; } | { pathname: `/signup`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } } | { pathname: `/circle/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/circle/edit/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/circle/delete/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/circle/leave/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/cylinder/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/circles${`?${string}` | `#${string}` | ''}` | `/circles${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/settings${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `/app-info${`?${string}` | `#${string}` | ''}` | `/circle/create${`?${string}` | `#${string}` | ''}` | `/circle/join${`?${string}` | `#${string}` | ''}` | `/cylinder/pair${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `/profile/change-avatar${`?${string}` | `#${string}` | ''}` | `/profile/change-password${`?${string}` | `#${string}` | ''}` | `/profile/change-profile-name${`?${string}` | `#${string}` | ''}` | `/profile/create${`?${string}` | `#${string}` | ''}` | `/profile/delete${`?${string}` | `#${string}` | ''}` | `/settings/account${`?${string}` | `#${string}` | ''}` | `/settings/notifications${`?${string}` | `#${string}` | ''}` | `/settings/privacy-policy${`?${string}` | `#${string}` | ''}` | `/signup${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/circles` | `/circles`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownInputParams; } | { pathname: `/app-info`; params?: Router.UnknownInputParams; } | { pathname: `/circle/create`; params?: Router.UnknownInputParams; } | { pathname: `/circle/join`; params?: Router.UnknownInputParams; } | { pathname: `/cylinder/pair`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-avatar`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-password`; params?: Router.UnknownInputParams; } | { pathname: `/profile/change-profile-name`; params?: Router.UnknownInputParams; } | { pathname: `/profile/create`; params?: Router.UnknownInputParams; } | { pathname: `/profile/delete`; params?: Router.UnknownInputParams; } | { pathname: `/settings/account`; params?: Router.UnknownInputParams; } | { pathname: `/settings/notifications`; params?: Router.UnknownInputParams; } | { pathname: `/settings/privacy-policy`; params?: Router.UnknownInputParams; } | { pathname: `/signup`; params?: Router.UnknownInputParams; } | `/+not-found` | `/circle/${Router.SingleRoutePart<T>}` | `/circle/edit/${Router.SingleRoutePart<T>}` | `/circle/delete/${Router.SingleRoutePart<T>}` | `/circle/leave/${Router.SingleRoutePart<T>}` | `/cylinder/${Router.SingleRoutePart<T>}` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } } | { pathname: `/circle/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/edit/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/delete/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/circle/leave/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/cylinder/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
