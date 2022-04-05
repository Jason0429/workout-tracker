import { createState, useHookstate } from '@hookstate/core';
import { UserType } from '../firebase/User';

const userState = createState(null as UserType | null);

export const useUserState = () => {
	// return useHookstate(userState);
	const state = useHookstate(userState);

	return {
		get id() {
			return state.value?.id ?? '';
		},
		get email() {
			return state.value?.email ?? null;
			// return state.ornull?.email.get();
		},
		get photoURL() {
			return state.value?.photoURL ?? null;
		},
		get name() {
			return state.value?.name ?? null;
		},
		get workouts() {
			return state.value?.workouts ?? [];
		},
		get templates() {
			return state.value?.templates ?? [];
		},
		get exercises() {
			return state.value?.exercises ?? [];
		},

		/**
		 * Sets user state to given user object.
		 * @param userObj the user object.
		 */
		set(userObj: UserType | null) {
			state.set(userObj);
		}
	};
};
