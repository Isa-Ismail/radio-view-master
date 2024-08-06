"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/zustand/context"; // Adjust the import path as necessary

export default function Home() {
  const router = useRouter();
  const { userData } = useUserStore();
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      router.push("/studies");
    } else {
      router.push("/clinician-login");
    }
  }, [userData, router]);

  return null; // This component does not render anything
}
