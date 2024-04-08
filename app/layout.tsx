import '@web3modal/wagmi/react';
import './global.css';

import { headers } from 'next/headers';
import React from 'react';
import { cookieToInitialState } from 'wagmi';
import { wagmiConfig } from '../config/wagmi';
import ClientLayout from './components/client-layout';
import ClientProviders from './components/client-providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'));

  return (
    <html lang="en" data-theme="dark">
      <body>
        <ClientProviders initialState={initialState}>
          <ClientLayout>{children}</ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
