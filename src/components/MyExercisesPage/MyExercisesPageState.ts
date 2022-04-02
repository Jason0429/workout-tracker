import { createState, useHookstate } from "@hookstate/core";

export type MyExercisesPageState = {};

const myExercisesPageState = createState({} as MyExercisesPageState);

export const useMyExercisesPageState = () => {
	const state = useHookstate(myExercisesPageState);

	return {};
};
