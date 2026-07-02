import React, { PropsWithChildren, ReactNode, useMemo } from "react";
import { useTextures, useUpdate } from "@openhotel/pixi-components";
import { parse } from "yaml";
import { LoaderItem, useAssets } from "../shared";

type PreProps = {
  assets?: string[];
  spriteSheets?: string[];
  textures?: string[];
  LoaderAssetsComponent: React.ElementType<{
    loaderItems: LoaderItem[];
    children: ReactNode;
    onDone: () => void;
  }>;
};

type Props = {} & PropsWithChildren;

export const CoreLoaderComponent =
  ({
    assets = [],
    spriteSheets = [],
    textures = [],
    LoaderAssetsComponent,
  }: PreProps): React.FC<Props> =>
  ({ children }) => {
    const { update, lastUpdate } = useUpdate();
    const { loadSpriteSheet, loadTexture, getTexture, getSpriteSheet } =
      useTextures();
    const { setAsset, getAsset } = useAssets();

    const loaderItems = useMemo(() => {
      const $assets = assets.filter((asset) => !getAsset(asset));
      const $spriteSheets = spriteSheets.filter(
        (spriteSheet) => !getSpriteSheet(spriteSheet),
      );
      const $textures = textures.filter((texture) => !getTexture({ texture }));

      return [
        {
          label: "system.asset_label",
          items: $assets,
          func: async (asset: string) => {
            const response = await fetch(asset);
            const format = asset.split(".")[1];

            let data = await (format === "json"
              ? response.json()
              : response.text());
            if (format === "yml") data = parse(data);
            setAsset(asset, data);
          },
        },
        {
          label: "system.sprite_sheet_label",
          items: $spriteSheets,
          func: loadSpriteSheet,
        },
        {
          label: "system.texture_label",
          items: $textures,
          func: loadTexture,
        },
      ].filter((item) => item.items.length) as LoaderItem[];
    }, [
      loadSpriteSheet,
      loadTexture,
      setAsset,
      getTexture,
      getSpriteSheet,
      getAsset,
      lastUpdate,
      assets,
      spriteSheets,
      textures,
    ]);

    return (
      <LoaderAssetsComponent
        loaderItems={loaderItems}
        children={children}
        onDone={update}
      />
    );
  };
