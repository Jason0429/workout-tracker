import { createState, useHookstate } from "@hookstate/core";
import { UserType } from "../firebase/User";

const userState = createState(null as UserType | null);

export const useUserState = () => {
	const state = useHookstate(userState);

	return {
		get id() {
			return state.ornull?.id.get();
		},
		get email() {
			return state.ornull?.email.get();
		},
		get photoURL() {
			return state.ornull?.photoURL.get();
		},
		get name() {
			return state.ornull?.name.get();
		},
		get workouts() {
			return state.ornull?.workouts.get();
		},
		get templates() {
			return state.ornull?.templates.get();
		},
		get exercises() {
			return state.ornull?.exercises.get();
		}
	};
};
