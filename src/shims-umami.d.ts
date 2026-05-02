interface Umami {
  track: (event: string, data?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

declare module 'vue' {
  interface HTMLAttributes {
    'data-umami-event'?: string;
  }
}

export {};
