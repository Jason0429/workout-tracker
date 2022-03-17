import { createContext } from "react";

// Default value for theme is null.
// Will be set later in App to light mode.
const ThemeContext = createContext(null as any);

export default ThemeContext;
