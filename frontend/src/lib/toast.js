import { toast } from "sonner";

export const showToast = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  info: (message) => {
    toast.info(message);
  },
  warning: (message) => {
    toast.warning(message);
  },
};
