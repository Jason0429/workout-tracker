export type SetType = {
	reps: number;
	lbs: number;
	rpe: number;
};

export const Set = (reps?: number, lbs?: number, rpe?: number): SetType => ({
	reps: reps ?? 0,
	lbs: lbs ?? 0,
	rpe: rpe ?? 0
});
