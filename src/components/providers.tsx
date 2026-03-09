"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
}
