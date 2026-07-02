import React, { ReactNode, useMemo } from "react";
import {
  AssetsProvider,
  LoaderItem,
  NesterComponent,
  ProxyProvider,
} from "../shared";
import { RenderComponent } from "./render.component.tsx";
import { InitialLoaderComponent } from "./initial-loader.component.tsx";
import { CoreLoaderComponent } from "./core-loader.component.tsx";
import { StartComponent } from "./start.component.tsx";

type Props = {
  //provider, index, replace (deletes current provider on that index)
  providers?: ([React.FC, number, boolean] | [React.FC, number] | React.FC)[];

  initialSpriteSheets?: string[];
  assets?: string[];
  spriteSheets?: string[];
  textures?: string[];

  LoaderComponent: React.ElementType<{
    message: string | null;
    children: ReactNode;
  }>;
  LoaderAssetsComponent: React.ElementType<{
    loaderItems: LoaderItem[];
    children: ReactNode;
    onDone: () => void;
  }>;
};

export const ApplicationComponent: React.FC<Props> = ({
  providers = [],

  initialSpriteSheets = [],
  assets = [],
  spriteSheets = [],
  textures = [],

  LoaderComponent,
  LoaderAssetsComponent,
}) => {
  const $providers = useMemo(() => {
    const currentProviders: React.FC[] = [
      RenderComponent,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      InitialLoaderComponent({ initialSpriteSheets }),
      ProxyProvider({ LoaderComponent }),
      AssetsProvider,
      CoreLoaderComponent({
        assets,
        spriteSheets,
        textures,
        LoaderAssetsComponent,
      }),
      StartComponent,
    ];

    providers.forEach((providerData) => {
      if (Array.isArray(providerData)) {
        const [provider, index, replace] = providerData;
        replace
          ? (currentProviders[index] = provider)
          : currentProviders.splice(index, 0, provider);
        return;
      }
      currentProviders.push(providerData);
    });

    return currentProviders;
  }, [
    providers,
    initialSpriteSheets,
    assets,
    spriteSheets,
    textures,
    LoaderComponent,
    LoaderAssetsComponent,
  ]);

  return <NesterComponent components={$providers} />;
};
