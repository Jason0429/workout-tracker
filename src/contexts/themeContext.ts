import { createContext, Dispatch, SetStateAction } from "react";
import { ThemeType } from "../models";

// Default value for theme is null.
// Will be set later in App to light mode.
const ThemeContext = createContext(null as any);
// const ThemeContext = createContext(null as [ThemeType, Dispatch<SetStateAction<ThemeType>>] | null);

export default ThemeContext;
