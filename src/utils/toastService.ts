let showToastHandler: ((type: "success" | "error", title: string, message?: string) => void) | null = null;

export const ToastService = {
  register: (handler: typeof showToastHandler) => {
    showToastHandler = handler;
  },
  show: (type: "success" | "error", title: string, message?: string) => {
    showToastHandler?.(type, title, message);
  },
};
