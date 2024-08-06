import { closeConfirm, selectApp } from "@/store/app/appSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Dialog, Typography } from "@mui/material";

export default function ConfirmDialogProvider({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const { confirmPromise } = useAppSelector(selectApp);
  const dispatch = useAppDispatch();
  const { title, message, resolve, allowCancel, cancelText, confirmText } = confirmPromise ?? {};

  return (
    <>
      {children}
      <Dialog
        open={confirmPromise !== undefined}
        PaperProps={{
          style: {
            backgroundColor: "black",
            boxShadow: "none",
            borderRadius: "20px",
            minWidth: "500px",
          },
        }}>
        <div className="flex flex-col justify-center p-5 text-center items-center">
          {/* <Image
            alt="delete icon"
            src="/delete.png"
            width={40}
            height={40}
            className="mb-5"></Image> */}

          <div className="mb-5">
            <Typography variant="h6">{title ? title : "This action cannot be undone"}</Typography>
          </div>
          <div className="mb-5">
            <Typography variant="caption" className="mb-10">
              {message}
            </Typography>
          </div>
          <div className="flex justify-center space-x-2">
            {allowCancel === false ? (
              <></>
            ) : (
              <Button
                variant="outlined"
                nonce={nonce}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "1px solid white",
                  minWidth: "100px",
                }}
                color="inherit"
                disableElevation={true}
                onClick={() => {
                  // reject!();
                  resolve!(false);
                  dispatch(closeConfirm());
                }}>
                {cancelText ? cancelText : "Cancel"}
              </Button>
            )}
            <Button
              variant="contained"
              nonce={nonce}
              sx={{
                borderRadius: "20px",
                backgroundColor: "white",
                color: "black",
                border: "1px solid white",
                minWidth: "100px",
              }}
              disableElevation={true}
              onClick={() => {
                // resolve!();
                resolve!(true);
                dispatch(closeConfirm());
              }}>
              {confirmText ? confirmText : "Confirm"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
