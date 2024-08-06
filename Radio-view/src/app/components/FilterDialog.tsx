import AppButton from "@/app/components/Button";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

export default function FilterDialog<T>({
  dialogOpen,
  setDialogOpen,
  onConfirm,
  onReset,
  children,
  setProps,
  onCancel,
  shouldConfirm,
  nonce,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onConfirm: () => void;
  onReset: () => void;
  children: React.ReactNode;

  setProps: (props: T | undefined) => void;
  onCancel?: () => void;
  shouldConfirm?: boolean;
  nonce: string;
}) {
  const reset = () => {
    setProps(undefined);

    onReset();
    setDialogOpen(false);
  };

  const confirm = () => {
    if (shouldConfirm === false) return;
    setDialogOpen(false);
    onConfirm();
  };
  const cancel = () => {
    setDialogOpen(false);
    if (onCancel) {
      onCancel();
    }
  };
  return (
    <Dialog
      maxWidth="md"
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
      }}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <AppButton variant="outlined" onClick={reset} nonce={nonce}>
          Reset
        </AppButton>
        <AppButton variant="outlined" onClick={cancel} nonce={nonce}>
          Cancel
        </AppButton>
        <AppButton onClick={confirm} nonce={nonce}>
          Apply
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
