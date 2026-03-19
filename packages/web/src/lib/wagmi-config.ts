import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { sepolia, baseSepolia, hardhat } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { clientEnv } from "@/lib/env";

const projectId = clientEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia, hardhat],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});
