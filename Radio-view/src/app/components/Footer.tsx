import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <Link
          href="https://neurocare.ai"
          target="_blank"
          className="flex flex-row justify-center items-center">
          Powered By{" "}
          <Image
            className="ml-2 "
            src={"/neurocareai-logo.png"}
            alt="Neurocare.Ai Logo"
            width={150}
            height={20}></Image>
        </Link>
      </div>
    </div>
  );
}
