"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/zustand/context"; // Adjust the import path as necessary

export default function Home() {
  const router = useRouter();
  const { userData } = useUserStore();
  useEffect(() => {
    router.push("/clinician-view");
  }, [userData, router]);

  return null; // This component does not render anything
}
