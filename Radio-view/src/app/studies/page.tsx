import { headers } from "next/headers";
import StudiesPage from "./studies_page";
import Appbar from "../components/Appbar";
import Image from "next/image";
import { Typography } from "@mui/material";
import Footer from "../components/Footer";
import { Logout } from "@mui/icons-material";
import LogoutButton from "../components/LogoutButton";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div>
        <div className="bg-[#1C1D1F] w-[100vw] p-4 flex justify-between gap-6 items-center">
          <div className="flex gap-6 items-center">
            <Image alt="logo" src={"/logo.png"} width={70} height={70} />
            <Typography variant="h4">RadioView.AI</Typography>
          </div>
          <div>
            <LogoutButton />
          </div>
        </div>
        <div className="p-10">
          <StudiesPage nonce={nonce} />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
