import { Exercise, ExerciseType } from "../models";

const CHEST = "Chest";
const SHOULDERS = "Shoulders";
const TRICEPS = "Triceps";
const BICEPS = "Biceps";
const LEGS = "Legs";
const BACK = "Back";
const FULL_BODY = "Full Body";

export const exercises: ExerciseType[] = [
	Exercise("Bench Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Incline Bench Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Decline Bench Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Incline Dumbbell Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Flat Dumbbell Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Decline Dumbbell Press", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Push-ups", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Dips", [CHEST, SHOULDERS, TRICEPS]),
	Exercise("Overhead Barbell Press", [SHOULDERS, TRICEPS]),
	Exercise("Upright Row", [SHOULDERS, TRICEPS]),
	Exercise("Dumbbell Shoulder Press", [SHOULDERS, TRICEPS]),
	Exercise("Lateral Raises", [SHOULDERS]),
	Exercise("Front Raises", [SHOULDERS]),
	Exercise("Face Pulls", [SHOULDERS]),
	Exercise("Tricep Extensions", [TRICEPS]),
	Exercise("Overhead Tricep Extensions", [TRICEPS]),
	Exercise("Dumbbell Fly", [CHEST]),
	Exercise("Machine Fly", [CHEST]),
	Exercise("Dumbbell Pullover", [CHEST]),
	Exercise("Pull-ups", [BACK, BICEPS]),
	Exercise("Lat Pulldown", [BACK, BICEPS]),
	Exercise("High Row Machine", [BACK, BICEPS]),
	Exercise("Cable Rows", [BACK, BICEPS]),
	Exercise("Dumbbell Rows", [BACK, BICEPS]),
	Exercise("One-Arm Dumbbell Rows", [BACK, BICEPS]),
	Exercise("Cable Curls", [BICEPS]),
	Exercise("Dumbbell Curls", [BICEPS]),
	Exercise("Spider Curls", [BICEPS]),
	Exercise("Barbell Squat", [LEGS]),
	Exercise("Goblet Squat", [LEGS]),
	Exercise("Dumbbell Squat", [LEGS]),
	Exercise("Conventional Deadlift", [LEGS]),
	Exercise("Sumo Deadlift", [LEGS]),
	Exercise("Romanian Deadlift", [LEGS]),
	Exercise("Leg Press", [LEGS]),
	Exercise("Leg Extension", [LEGS]),
	Exercise("Leg Curls", [LEGS]),
	Exercise("Calf Raises", [LEGS]),
	Exercise("Burpees", [FULL_BODY])
];
