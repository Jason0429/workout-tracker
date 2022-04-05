import { createState, useHookstate } from "@hookstate/core";
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

const themeState = createState(themes[localStorage.getItem("themeMode") ?? "light"]);

export const useThemeState = () => {
	const state = useHookstate(themeState);

	return {
		get mode() {
			return state.mode.get();
		},
		get background() {
			return state.background.get();
		},
		get paperBackground() {
			return state.paperBackground.get();
		},
		get paperBackgroundHover() {
			return state.paperBackgroundHover.get();
		},
		get text() {
			return state.text.get();
		},
		get detailText() {
			return state.detailText.get();
		},
		get transition() {
			return state.transition.get();
		},
		/**
		 * Handles toggling theme.
		 */
		toggleTheme() {
			state.set((prev) => {
				const newMode = prev.mode === "light" ? "dark" : "light";
				localStorage.setItem("themeMode", newMode);
				return themes[newMode];
			});
		}
	};
};
