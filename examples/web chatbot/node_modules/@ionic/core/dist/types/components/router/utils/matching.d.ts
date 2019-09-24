import { RouteID, RouteRedirect } from './interface';
export declare const matchesRedirect: (input: string[], route: RouteRedirect) => route is RouteRedirect;
export declare const routeRedirect: (path: string[], routes: RouteRedirect[]) => RouteRedirect | undefined;
export declare const matchesIDs: (ids: string[], chain: import("./interface").RouteEntry[]) => number;
export declare const matchesPath: (inputPath: string[], chain: import("./interface").RouteEntry[]) => import("./interface").RouteEntry[] | null;
export declare const mergeParams: (a: any, b: any) => any;
export declare const routerIDsToChain: (ids: RouteID[], chains: import("./interface").RouteEntry[][]) => import("./interface").RouteEntry[] | null;
export declare const routerPathToChain: (path: string[], chains: import("./interface").RouteEntry[][]) => import("./interface").RouteEntry[] | null;
export declare const computePriority: (chain: import("./interface").RouteEntry[]) => number;
export declare class RouterSegments {
    private path;
    constructor(path: string[]);
    next(): string;
}
