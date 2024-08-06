import { AxiosClient, useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { initiateLogout, logout } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { getValidAuthTokens } from "./cookie";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const { errorSnackbar } = useAppSnackbar();
  const axios = useClientAxiosClient();
  const { refreshToken } = getValidAuthTokens();
  const call = async () => {
    if (!refreshToken) {
      dispatch(logout({ session_expired: true }));
      return;
    }
    dispatch(initiateLogout());

    const res = await axios.get({
      path: "/logout/",
      headers: AxiosClient.getAuthHeaders({ token: refreshToken }),
    });
    dispatch(logout({ session_expired: false }));
  };
  return { call };
}
