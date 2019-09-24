import { RouteNode, RouteRedirect } from './interface';
export declare const readRedirects: (root: Element) => RouteRedirect[];
export declare const readRoutes: (root: Element) => import("./interface").RouteEntry[][];
export declare const readRouteNodes: (root: Element, node?: Element) => RouteNode[];
export declare const readProp: (el: HTMLElement, prop: string) => string | null | undefined;
export declare const flattenRouterTree: (nodes: RouteNode[]) => import("./interface").RouteEntry[][];
