export type SnackbarType = {
	open: boolean;
	message: string;
};

export type ThemeType = {
	// [index: string]: string;
	mode: string;
	background: string;
	paperBackground: string;
	paperBackgroundHover: string;
	text: string;
	detailText: string;
	transition: string;
};

export type ThemesType = {
	[index: string]: ThemeType;
};
