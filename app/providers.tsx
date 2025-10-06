"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "next-themes";
export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}
