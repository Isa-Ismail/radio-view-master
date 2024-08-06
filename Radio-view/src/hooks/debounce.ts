const useDebouncer = (delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (callback: () => void) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
};

export default useDebouncer;
