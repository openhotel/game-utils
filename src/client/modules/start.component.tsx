import React, { useEffect, useState } from "react";
import { useWindow } from "@openhotel/pixi-components";
import { useProxy } from "../shared";

type Props = {} & React.PropsWithChildren;

export const StartComponent: React.FC<Props> = ({ children }) => {
  const { ready, on } = useProxy();
  const { setSize } = useWindow();

  const [onWindowChange, setOnWindowChange] = useState(false);

  useEffect(() => {
    on("$$settings", (config: any) => {
      if (config.screen === "windowed") {
        setSize(config.windowSize);
        setOnWindowChange(true);
      }
    });
  }, [on, setSize, setOnWindowChange]);

  useEffect(() => {
    ready();
  }, [ready]);

  return onWindowChange ? children : null;
};
