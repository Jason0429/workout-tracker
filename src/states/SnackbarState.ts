import { createState, useHookstate } from "@hookstate/core";

export type SnackbarState = {
	open: boolean;
	message: string;
	autoCloseDelay: number;
};

export const snackbarState = createState({
	open: false,
	message: "",
	autoCloseDelay: 3000
} as SnackbarState);

export const useSnackbarState = () => {
	const state = useHookstate(snackbarState);

	return {
		get open() {
			return state.open.get();
		},
		get message() {
			return state.message.get();
		},
		get autoCloseDelay() {
			return state.autoCloseDelay.get();
		},

		/**
		 * Handles closing snackbar.
		 */
		handleCloseSnackbar() {
			state.set((prev) => ({
				...prev,
				open: false
			}));
		},

		/**
		 * Handles opening snackbar with message.
		 * @param message the message to display.
		 */
		handleOpenSnackbar(message: string) {
			state.set((prev) => ({
				...prev,
				open: true,
				message
			}));
		}
	};
};
