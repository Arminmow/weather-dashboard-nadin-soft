import { PaletteOptions, Palette } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    surface: {
      main: string;
      card: string;
      item: string;
    };
    customText: {
      main: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      main?: string;
      card?: string;
      item?: string;
    };
    customText?: {
      main?: string;
    };
  }
}
