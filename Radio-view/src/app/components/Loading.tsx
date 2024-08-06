"use client";

import { Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const Loader = ({ value, nonce }: { value?: number; nonce: string }) => {
  const [width, setWidth] = useState(value || 1);

  return (
    <div className="loaderContainer">
      <Image src={"/loading.png"} alt="NeuroICH Logo" width={150} height={150} priority={true} />

      <div className="loader mt-5 mb-5">
        <div className="progress-bar" nonce={nonce} style={{ width: `${width * 100}%` }} />
      </div>
      <Typography variant="h6">Loading...</Typography>
      <div className="mt-3 w-1/3 text-center">
        You’re almost done! Sometimes it will take time, so be patient and hold tight...
      </div>
    </div>
  );
};

export default Loader;
