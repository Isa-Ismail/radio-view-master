import React from "react";

interface Props {}

const page = () => {
  return (
    <div>
      hi
      <iframe
        style={{ height: "100vh", width: "100vw" }}
        src="https://demoapp.radioview.ai/viewer?StudyInstanceUIDs=1.2.276.0.7230010.3.1.2.811938916.1.1719000807.352293"
      ></iframe>
    </div>
  );
};

export default page;
