import type { Eip1193Provider } from 'ethers';

interface ExtendedEthereumProvider extends Eip1193Provider {
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: ExtendedEthereumProvider;
  }
}
