import type { Eip1193Provider } from 'ethers';

interface ExtendedEthereumProvider extends Eip1193Provider {
  on?: (event: 'accountsChanged', listener: (accounts: string[]) => void) => void;
  removeListener?: (event: 'accountsChanged', listener: (accounts: string[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: ExtendedEthereumProvider;
  }
}

export {};
