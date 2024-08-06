"use client";

import { Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const logout = () => {
    router.push("/clinician-login");
    // clear local storage after logout
    localStorage.clear();
  };
  return (
    <button onClick={logout}>
      <Logout />
    </button>
  );
};

export default LogoutButton;
