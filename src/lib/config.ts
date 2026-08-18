import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Define 0G Galileo Testnet
export const galileo = {
  id: 16602,
  name: '0G Galileo Testnet',
  network: '0g-galileo',
  nativeCurrency: {
    decimals: 18,
    name: '0G',
    symbol: '0G',
  },
  rpcUrls: {
    public: { http: ['https://evmrpc-testnet.0g.ai'] },
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G Explorer', url: 'https://chainscan-galileo.0g.ai' },
  },
} as const;

export const config = createConfig({
  chains: [galileo, mainnet, sepolia],
  transports: {
    [galileo.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
