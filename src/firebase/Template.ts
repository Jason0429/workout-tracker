import { ExerciseType } from "./Exercise";
import { v4 as uuidv4 } from "uuid";
import FirebaseObject from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getUser } from "./User";
import { WorkoutType } from "./Workout";

export type TemplateWorkoutType = TemplateType | WorkoutType;

export type TemplateType = {
	name: string;
	exercises: ExerciseType[];
	id: string;
};

export const Template = (name?: string, exercises?: ExerciseType[]): TemplateType => ({
	name: name ?? "",
	exercises: exercises ?? [],
	id: uuidv4()
});

/**
 * Adds template object to user's list of templates.
 * @param template the template object to be added.
 */
export const addTemplate = async (template: TemplateType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updatedTemplates = { templates: [...user.templates, template] };
		await updateDoc(docPath, updatedTemplates);
	} catch (e) {
		throw new Error("Could not add template.");
	}
};

/**
 * Deletes template with specified id.
 * @param id the template id.
 */
export const deleteTemplate = async (id: string) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updatedTemplates = { templates: user.templates.filter((t) => t.id !== id) };
		await updateDoc(docPath, updatedTemplates);
	} catch (e) {
		throw new Error("Could not delete template.");
	}
};

/**
 * Updates template with specified id.
 * @param id the template id.
 */
export const updateTemplate = async (template: TemplateType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updatedTemplates = {
			templates: user.templates.map((t) => (t.id !== template.id ? t : template))
		};
		await updateDoc(docPath, updatedTemplates);
	} catch (e) {
		throw new Error("Could not update template.");
	}
};
