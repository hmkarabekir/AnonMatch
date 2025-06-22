// walletConnect.js freighter cüzdan bağlantısı kodu 
//navbar kısmı cüzdan bağla component 

import { create } from 'zustand';
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
  WatchWalletChanges
} from '@stellar/freighter-api';

// Wallet watcher instance
let walletWatcher = null;

export const useWalletStore = create((set, get) => ({
  // Initial state
  isConnected: false,
  address: null,
  publicKey: null,
  balance: '0',
  network: 'testnet',
  isLoading: false,
  error: null,

  // Clear error state
  clearError: () => set({ error: null }),

  // Connect to Freighter wallet
  connect: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection only available in browser');
      }
      
      console.log('🔍 Checking Freighter availability...');
      
      // Step 1: Check if Freighter is installed
      const connectionCheck = await isConnected();
      console.log('Connection check result:', connectionCheck);
      
      if (!connectionCheck.isConnected) {
        throw new Error('Freighter cüzdanı yüklü değil. Lütfen https://www.freighter.app/ adresinden Freighter extension\'ını yükleyin.');
      }
      
      console.log('✅ Freighter is installed');
      
      // Step 2: Check if app is allowed
      const allowedCheck = await isAllowed();
      console.log('Allowed check result:', allowedCheck);
      
      if (!allowedCheck.isAllowed) {
        console.log('App not allowed, requesting permission...');
        
        // Request permission to access Freighter
        const setAllowedResult = await setAllowed();
        console.log('Set allowed result:', setAllowedResult);
        
        if (!setAllowedResult.isAllowed) {
          throw new Error('Cüzdan erişimi reddedildi. Lütfen Freighter cüzdanınızda erişime izin verin.');
        }
      }
      
      console.log('✅ App is allowed to access Freighter');
      
      // Step 3: Request access to get public key
      console.log('Requesting access to get public key...');
      const accessResult = await requestAccess();
      console.log('Access result:', accessResult);
      
      if (accessResult.error) {
        throw new Error(`Cüzdan erişimi hatası: ${accessResult.error}`);
      }
      
      if (!accessResult.address || typeof accessResult.address !== 'string') {
        throw new Error('Geçersiz cüzdan adresi alındı. Lütfen Freighter cüzdanınızı kontrol edin.');
      }
      
      const publicKey = accessResult.address;
      console.log('✅ Public key obtained:', publicKey);
      
      // Step 4: Get network information
      let networkResult;
      try {
        networkResult = await getNetwork();
        console.log('Network result:', networkResult);
      } catch (err) {
        console.warn('Network detection failed:', err);
        networkResult = { network: 'TESTNET' }; // Default to testnet
      }
      
      const mappedNetwork = networkResult.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      console.log('✅ Network detected:', mappedNetwork);
      
      // Step 5: Get detailed network info
      let networkDetails;
      try {
        networkDetails = await getNetworkDetails();
        console.log('Network details:', networkDetails);
      } catch (err) {
        console.warn('Network details failed:', err);
      }
      
      // Update store with connection info
      set({
        isConnected: true,
        address: publicKey,
        publicKey: publicKey,
        network: mappedNetwork,
        isLoading: false,
        error: null
      });
      
      // Start watching for wallet changes
      get().startWalletWatcher();
      
      console.log('🎉 Wallet connected successfully:', publicKey);
      
      // Refresh balance
      get().refreshBalance();
      
    } catch (error) {
      const errorMessage = error.message || 'Bilinmeyen bağlantı hatası';
      
      console.error('❌ Wallet connection failed:', errorMessage);
      
      set({
        isConnected: false,
        address: null,
        publicKey: null,
        network: null,
        isLoading: false,
        error: errorMessage
      });
      
      throw error;
    }
  },

  // Disconnect wallet
  disconnect: () => {
    if (walletWatcher) {
      walletWatcher.stop();
      walletWatcher = null;
    }

    set({
      isConnected: false,
      address: null,
      publicKey: null,
      balance: '0',
      network: null,
      error: null
    });
    console.log('🔌 Wallet disconnected');
  },

  // Switch network (Note: This requires user to manually switch in Freighter)
  switchNetwork: async (network) => {
    set({ isLoading: true, error: null });
    
    try {
      const networkResult = await getNetwork();
      console.log('Current network:', networkResult);
      
      const currentNetwork = networkResult.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      
      if (currentNetwork === network) {
        set({ isLoading: false });
        return;
      }

      const targetNetwork = network === 'mainnet' ? 'Mainnet (PUBLIC)' : 'Testnet';
      throw new Error(
        `Lütfen Freighter cüzdanınızın ayarlarından ${targetNetwork} ağına geçin, sonra tekrar bağlanın.`
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network switch failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
    }
  },

  // Refresh XLM balance
  refreshBalance: async () => {
    const { address, isConnected } = get();
    
    if (!isConnected || !address) {
      return;
    }

    try {
      console.log(`💰 Refreshing balance for ${address}...`);
      
      // In production, you would fetch the actual balance from Horizon
      // For now, we'll use a mock balance
      const mockBalance = '100.0000000';
      set({ balance: mockBalance });
      
      console.log('✅ Balance refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh balance:', error);
    }
  },

  // Check if wallet is still connected
  checkConnection: async () => {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      console.log('🔍 Checking wallet connection...');

      const connectionCheck = await isConnected();
      console.log('Connection check result:', connectionCheck);
      
      if (!connectionCheck.isConnected) {
        console.log('❌ Wallet not connected, disconnecting...');
        get().disconnect();
        return;
      }

      const { isConnected: storeConnected, address } = get();
      
      // If we think we're connected but don't have an address, try to get it
      if (storeConnected && !address) {
        try {
          console.log('🔍 Retrieving address...');
          const addrResult = await getAddress();
          console.log('Address result:', addrResult);
          
          if (addrResult.address && typeof addrResult.address === 'string' && addrResult.address.length > 10) {
            set({ 
              address: addrResult.address, 
              publicKey: addrResult.address,
              isConnected: true,
              error: null
            });
            console.log('✅ Address retrieved during connection check:', addrResult.address);
          } else {
            console.log('❌ Invalid address, disconnecting...');
            get().disconnect();
          }
        } catch (err) {
          console.warn('❌ Failed to get address during connection check:', err);
          get().disconnect();
        }
      }
      
      // If we have an address but think we're not connected, update state
      if (!storeConnected && address) {
        set({
          isConnected: true,
          error: null
        });
        console.log('✅ Connection state corrected - wallet is connected');
      }
      
      console.log('✅ Connection check completed - connected:', connectionCheck.isConnected, 'address:', address);
    } catch (error) {
      console.error('❌ Connection check failed:', error);
      // Don't disconnect on error, just log it
    }
  },

  // Start wallet watcher (internal method)
  startWalletWatcher: () => {
    if (walletWatcher) {
      walletWatcher.stop();
    }

    console.log('👀 Starting wallet watcher...');
    walletWatcher = new WatchWalletChanges(3000);
    
    walletWatcher.watch((changes) => {
      console.log('🔄 Wallet changes detected:', changes);
      
      const { address: currentAddress, network: currentNetwork } = get();
      
      if (changes.address !== currentAddress) {
        if (changes.address && typeof changes.address === 'string') {
          set({
            address: changes.address,
            publicKey: changes.address,
            isConnected: true
          });
          console.log('✅ Wallet address changed:', changes.address);
        } else {
          console.log('❌ Address cleared, disconnecting...');
          get().disconnect();
        }
      }

      const mappedNetwork = changes.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      if (mappedNetwork !== currentNetwork) {
        set({ network: mappedNetwork });
        console.log('🌐 Network changed:', changes.network);
      }
    });
    
    console.log('✅ Wallet watcher started');
  }
}));

// Transaction signing utility
export const userSignTransaction = async (xdr, network, signWith) => {
  try {
    console.log('✍️ Signing transaction...');
    console.log('XDR:', xdr);
    console.log('Network:', network);
    console.log('Sign with:', signWith);
    
    const signedTransactionRes = await signTransaction(xdr, {
      network,
      address: signWith,
    });
    
    console.log('✅ Transaction signed successfully');
    return signedTransactionRes.signedTxXdr;
    
  } catch (error) {
    console.error('❌ Transaction signing failed:', error);
    throw new Error(`Transaction signing failed: ${error.message}`);
  }
}; 