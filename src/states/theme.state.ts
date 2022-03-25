import { createState } from "@hookstate/core";
import { ThemesType, ThemeType } from "../models";

export const light: ThemeType = {
	mode: "light",
	background: "#ffffff",
	paperBackground: "#f2f2f2",
	paperBackgroundHover: "#eeeeee",
	text: "#212121",
	detailText: "#444444",
	transition: "all 0.2s ease-in-out"
};

export const dark: ThemeType = {
	mode: "dark",
	background: "#333333",
	paperBackground: "#555555",
	paperBackgroundHover: "#666666",
	text: "#ffffff",
	detailText: "#dddddd",
	transition: "all 0.2s ease-in-out"
};

export const themes: ThemesType = {
	light,
	dark
};

export const globalTheme = createState(themes[localStorage.getItem("themeMode") ?? "light"]);

/**
 * Handles toggling global theme.
 */
export const toggleTheme = () => {
	globalTheme.set((prev) => (prev.mode === "light" ? themes.dark : themes.light));
};
