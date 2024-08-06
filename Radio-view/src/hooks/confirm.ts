import { setConfirmPromise } from "@/store/app/appSlice";
import { useAppDispatch } from "@/store/hooks";
const useConfirm = () => {
  const dispatch = useAppDispatch();

  const confirm = ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    allowCancel = true,
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    allowCancel?: boolean;
  }): Promise<boolean> =>
    new Promise<boolean>((resolve, reject) => {
      dispatch(
        setConfirmPromise({
          resolve,
          reject,
          title,
          message,
          confirmText,
          cancelText,
          allowCancel,
        })
      );
    });

  return confirm;
};

export default useConfirm;
