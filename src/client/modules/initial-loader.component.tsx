import React, { PropsWithChildren, useEffect, useState } from "react";
import { useTextures } from "@openhotel/pixi-components";

type PreProps = {
  initialSpriteSheets?: string[];
};
type Props = {} & PropsWithChildren;

export const InitialLoaderComponent =
  ({ initialSpriteSheets }: PreProps): React.FC<Props> =>
  ({ children }) => {
    const { loadSpriteSheet } = useTextures();

    const [isLoaded, setIsLoaded] = useState<boolean>(initialSpriteSheets.length === 0);

    useEffect(() => {
      if(initialSpriteSheets.length === 0) return;

      Promise.all(initialSpriteSheets.map(loadSpriteSheet)).then(() => {
        setIsLoaded(true);
      });
    }, [loadSpriteSheet, setIsLoaded, initialSpriteSheets]);

    return isLoaded ? children : null;
  };
