"use client";
import LinkIcon from "@mui/icons-material/Link";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SettingsTile({
  title,
  isExternal,
  icon,
  link,
}: {
  title: string;
  isExternal?: boolean;
  icon: React.ReactNode;
  link: string;
}) {
  let target = "_self";
  if (isExternal) {
    target = "_blank";
  }
  const [selected, setSelected] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setSelected(pathname === link);
  }, [pathname, link]);
  return (
    <Link href={link} target={target}>
      <ListItemButton selected={selected}>
        <ListItemIcon>
          <div className="text-gray-400">{icon}</div>
        </ListItemIcon>
        <ListItemText primary={title} />
        {isExternal && (
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
        )}
      </ListItemButton>
    </Link>
  );
}
