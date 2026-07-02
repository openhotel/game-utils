import React, { ReactNode, useCallback, useContext } from "react";
import { create } from "zustand";

export const useAssetsStore = create<{
  assets: Record<string, unknown>;
  setAsset: (assetKey: string, asset: unknown) => void;
  getAsset: (assetKey: string) => unknown;
}>((set, get) => ({
  assets: {} as Record<string, unknown>,
  setAsset: (assetKey: string, asset: unknown) =>
    set((state) => ({
      ...state,
      assets: {
        ...state.assets,
        [assetKey]: asset,
      },
    })),
  getAsset: (asset: string) => get().assets[asset],
}));

export type AssetsState = {
  getAsset: <Data>(assetKey: string) => Data;
  setAsset: (assetKey: string, data: unknown) => void;
};

export const AssetsContext = React.createContext<AssetsState>(undefined);

type AssetsProps = {
  children: ReactNode;
};

export const AssetsProvider: React.FunctionComponent<AssetsProps> = ({
  children,
}) => {
  const { setAsset: $setAsset, getAsset: $getAsset } = useAssetsStore();

  const getAsset = useCallback(
    (assetKey: string) => $getAsset(assetKey) as any,
    [$getAsset],
  );
  const setAsset = useCallback(
    (assetKey: string, data: unknown) => {
      $setAsset(assetKey, data);
    },
    [$setAsset],
  );

  return (
    <AssetsContext.Provider
      value={{
        getAsset,
        setAsset,
      }}
      children={children}
    />
  );
};

export const useAssets = (): AssetsState => useContext(AssetsContext);
