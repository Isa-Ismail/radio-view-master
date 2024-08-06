import { Typography } from "@mui/material";
import NoMatch from "../../../../icons/studies/NotFound.jpg";
import React from "react";
import Image from "next/image";

interface Props {}

const NotFound = () => {
  return (
    <div className="flex w-[100%] py-10 flex-col justify-center items-center">
      <Image
        className="rounded-full"
        src={NoMatch}
        width={120}
        height={120}
        alt="src"
      />
      <Typography variant="h5">No results Found</Typography>
      <Typography className="text-gray-500" variant="h6">
        The search results could not be found. This may be due to a spelling
        error or the item does not exist.
      </Typography>
    </div>
  );
};

export default NotFound;
