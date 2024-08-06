"use client";

import { Add } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Card, IconButton, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import AppButton from "./Button";

export default function DefaultViewLayout({
  children,
  name,
  route,
  header,
  showActions = true,
  onRefresh,
  formLoading,
  actionsTitle,
  pruralTitle = true,
  nonce,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  name: string;
  route: string;
  showActions?: boolean;
  onRefresh?: () => void;
  formLoading?: boolean;

  actionsTitle?: string;
  pruralTitle?: boolean;
  nonce: string;
}) {
  const path = usePathname();

  const edit = path.includes("edit");
  const add = path.includes("add");

  const show = !edit && !add;
  const router = useRouter();
  return (
    <>
      <Card nonce={nonce} className="p-6">
        <div className="flex justify-between flex-row align-middle">
          {edit && <Typography variant="h6">Edit {name}</Typography>}
          {add && <Typography variant="h6">Add {name}</Typography>}
          {show && (
            <Typography variant="h6">
              {pruralTitle
                ? name.endsWith("y")
                  ? name.slice(0, -1) + "ies"
                  : name + "s"
                : name}
            </Typography>
          )}
          {showActions ? (
            <div>
              {show && (
                <div>
                  <AppButton
                    nonce={nonce}
                    variant="contained"
                    onClick={() => {
                      router.push(`/${route}/add`);
                    }}
                    color="#FFFFFF"
                  >
                    <Add fontSize="small"></Add>
                    Add {actionsTitle ?? name}
                  </AppButton>
                </div>
              )}
              {!show && (
                <>
                  <AppButton
                    nonce={nonce}
                    variant="outlined"
                    onClick={() => {
                      router.replace(`/${route}`);
                    }}
                    className="mr-2"
                  >
                    Cancel
                  </AppButton>

                  <AppButton
                    nonce={nonce}
                    type="submit"
                    form={name}
                    variant={"contained"}
                    loading={formLoading}
                  >
                    {edit ? "Save" : "Add"}
                  </AppButton>
                </>
              )}
            </div>
          ) : null}
          {onRefresh && (
            <>
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </>
          )}
        </div>
      </Card>
      {header && <div className="pt-6">{header}</div>}

      <br />
      <Card className="p-6">{children}</Card>
    </>
  );
}
