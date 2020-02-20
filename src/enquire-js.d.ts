declare module 'enquire-js' {
  export function enquireScreen(
    cb: (isMobile: boolean) => void,
    query?: any
  ): { match: () => void; unmatch: () => void };
  export function unenquireScreen(handler: () => void, query?: any): void;
}
