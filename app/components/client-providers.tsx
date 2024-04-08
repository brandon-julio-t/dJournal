'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComponentType, PropsWithChildren } from 'react';
import { State, WagmiProvider } from 'wagmi';
import { projectId, wagmiConfig } from '../../config/wagmi';
import { createWeb3Modal } from '@web3modal/wagmi';

const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId: projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

const ClientProviders: ComponentType<PropsWithChildren<{ initialState?: State }>> = ({ children, initialState }) => {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default ClientProviders;
