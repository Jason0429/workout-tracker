import { Dispatch, SetStateAction } from "react";
import { exercises } from "./data/exercises";
import { v4 as uuidv4 } from "uuid";
import { User } from "firebase/auth";

export type TemplateWorkoutType = TemplateType | WorkoutType;

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

export type UserType = {
	id: string;
	email: string | null;
	photoURL: string | null;
	name: string | null;
	workouts: WorkoutType[];
	templates: TemplateType[];
	exercises: ExerciseType[];
};

export type WorkoutType = {
	name: string;
	exercises: ExerciseType[];
	dateCreated: number;
	id: string;
};

export type ExerciseType = {
	name: string;
	categories: string[];
	id: string;
	sets: SetType[];
};

export type SetType = {
	reps: number;
	lbs: number;
	rpe: number;
};

export type TemplateType = {
	name: string;
	exercises: ExerciseType[];
	id: string;
};

export const Workout = (
	name?: string,
	exercises?: ExerciseType[],
	dateCreated?: number
): WorkoutType => ({
	name: name ?? "",
	exercises: exercises ?? [],
	dateCreated: dateCreated ?? Date.now(),
	id: uuidv4()
});

export const Template = (name?: string, exercises?: ExerciseType[]): TemplateType => ({
	name: name ?? "",
	exercises: exercises ?? [],
	id: uuidv4()
});

export const Exercise = (name: string, categories: string[]): ExerciseType => ({
	name,
	categories,
	id: uuidv4(),
	sets: []
});

export const Set = (reps?: number, lbs?: number, rpe?: number): SetType => ({
	reps: reps ?? 0,
	lbs: lbs ?? 0,
	rpe: rpe ?? 0
});

export const NewUser = (): UserType => ({
	id: "",
	email: "",
	photoURL: "",
	name: "",
	workouts: [],
	templates: [],
	exercises
});
