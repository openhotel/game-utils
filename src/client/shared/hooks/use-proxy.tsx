import React, { ReactNode, useCallback, useContext, useState } from "react";
import { useConfig } from "./use-config";
import { ulid } from "ulidx";
import { getClientSocket, getRandomString, getWebSocketUrl } from "../utils";

export type ProxyState = {
  emit: <Data>(event: string, data: Data) => void;
  on: (
    event: string,
    callback: (data: unknown) => void | Promise<void>,
  ) => () => void;
  ready: () => void;
  exit: () => void;
};

export const ProxyContext = React.createContext<ProxyState>(undefined);

type PreProps = {
  LoaderComponent: React.ElementType<{
    message: string | null;
    children: ReactNode;
  }>;
};

type ProxyProps = {
  children: ReactNode;
};

export const ProxyProvider =
  ({ LoaderComponent }: PreProps): React.FunctionComponent<ProxyProps> =>
  ({ children }) => {
    const { isDevelopment } = useConfig();

    const [loadingMessage, setLoadingMessage] =
      useState<string>("system.connecting");

    const params = new URLSearchParams(location.search);
    const accountId =
      params.get("accountId") ?? (isDevelopment() ? ulid() : null);
    const token =
      params.get("token") ?? (isDevelopment() ? getRandomString(16) : null);
    const gameId = params.get("gameId") ?? (isDevelopment() ? ulid() : null);

    const [socket] = useState(() => {
      setLoadingMessage("system.connecting");

      const $socket = getClientSocket({
        url: getWebSocketUrl(`${window.location.origin}/proxy`),
        protocols: ["game", gameId, accountId, token],
        reconnect: false,
        silent: !isDevelopment(),
      });
      $socket.on("connected", () => {
        setLoadingMessage(null);
      });
      $socket.on("disconnected", () => {
        setLoadingMessage("system.proxy_disconnected");
      });
      $socket.connect().catch(() => {
        setLoadingMessage("proxy_not_reachable");
      });

      return $socket;
    });

    const emit = useCallback(
      (event: string, message: unknown) => {
        socket.emit("$$user-data", { event, message });
      },
      [socket],
    );

    const on = useCallback(
      (event: string, callback: (data: unknown) => void | Promise<void>) =>
        socket?.on(event, callback),
      [socket],
    );

    const ready = useCallback(() => {
      socket?.emit("$$user-ready", { d: Date.now(), p: performance.now() });
    }, [emit]);

    const exit = useCallback(() => {
      socket?.emit("$$user-exit", { d: Date.now(), p: performance.now() });
    }, [emit]);

    return (
      <ProxyContext.Provider
        value={{
          emit,
          on,
          ready,
          exit,
        }}
        children={
          <LoaderComponent message={loadingMessage} children={children} />
        }
      />
    );
  };

export const useProxy = (): ProxyState => useContext(ProxyContext);
