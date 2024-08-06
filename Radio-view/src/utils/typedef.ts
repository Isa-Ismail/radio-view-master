export type StoreReturnType<T> = {
  data?: T;
  error?: {
    status: number;
    statusText: string;
    data: any;
  };
};
