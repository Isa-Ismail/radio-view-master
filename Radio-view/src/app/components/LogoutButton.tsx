"use client";

import { Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const logout = () => {
    router.push("/clinician-login");
  };
  return (
    <button onClick={logout}>
      <Logout />
    </button>
  );
};

export default LogoutButton;
