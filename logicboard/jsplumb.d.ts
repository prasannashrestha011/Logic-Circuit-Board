declare module 'jsplumb' {
    export interface JsPlumbInstance {
      draggable(element: HTMLElement): void;
      connect(params: any): void;
      deleteEveryConnection(): void;
      reset(): void;
    }
  
    export function getInstance(): JsPlumbInstance;
  }
  