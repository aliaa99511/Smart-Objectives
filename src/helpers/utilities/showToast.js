import { toast } from "react-toastify";

export const showToast = ({ type, messgae }) => {
  toast[type](messgae); // type: success, warning, error, info
};
