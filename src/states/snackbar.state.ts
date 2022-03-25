import { createState } from "@hookstate/core";

export const globalSnackbar = createState({
	open: false,
	message: "",
	autoCloseDelay: 3000
});

export const handleCloseSnackbar = () => {
	globalSnackbar.set((prev) => ({ ...prev, open: false }));
};

export const handleOpenSnackbar = (message: string) => {
	globalSnackbar.set((prev) => ({ ...prev, open: true, message }));
};
