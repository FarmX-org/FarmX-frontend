"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode";

const theme = extendTheme({
  config: {
    initialColorMode: "light", 
    useSystemColorMode: false, 
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
