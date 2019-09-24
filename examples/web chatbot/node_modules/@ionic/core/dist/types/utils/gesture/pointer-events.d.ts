export declare const createPointerEvents: (el: Node, pointerDown: any, pointerMove: any, pointerUp: any, options: EventListenerOptions) => {
    setDisabled: (disabled: boolean) => void;
    stop: () => void;
    destroy: () => void;
};
export interface PointerEventsConfig {
    element?: HTMLElement;
    pointerDown: (ev: any) => boolean;
    pointerMove?: (ev: any) => void;
    pointerUp?: (ev: any) => void;
    zone?: boolean;
    capture?: boolean;
    passive?: boolean;
}
