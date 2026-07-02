import React, { useMemo } from "react";
import { ApplicationProvider } from "@openhotel/pixi-components";

export const RenderComponent: React.FC<React.PropsWithChildren> = ({
  children,
}) =>
  useMemo(
    () => <ApplicationProvider backgroundAlpha={0} children={children} />,
    [children],
  );
