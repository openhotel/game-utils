import { useCallback } from "react";

export const useConfig = () => {
  const isDevelopment = useCallback(
    () =>
      //@ts-ignore
      import.meta.env.MODE === "development",
    [],
  );
  return {
    isDevelopment,
  };
};
