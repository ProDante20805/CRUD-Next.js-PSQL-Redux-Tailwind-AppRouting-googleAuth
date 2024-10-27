"use client";
import "./globals.css";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js Project</title>
      </head>
      <body
      >
          <Provider store={store}>
              <SessionProvider>{children}</SessionProvider>
          </Provider>
      </body>
    </html>
  );
}
