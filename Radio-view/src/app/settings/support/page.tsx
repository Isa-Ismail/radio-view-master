import { Email } from "@mui/icons-material";
import Link from "next/link";

export default function Support() {
  return (
    <>
      We have a team ready to help with any issue you may be having. Contact NeuroCare.AI support
      for assistance.
      <div className="mt-4">
        <Link href="mailto:support@neurocare.ai" target="_blank">
          <Email></Email>
          <span className="ml-2">support@neurocare.ai</span>
        </Link>
      </div>
    </>
  );
}
