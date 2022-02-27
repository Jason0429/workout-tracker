import { createContext, Dispatch, SetStateAction } from "react";

// Default value for user is null.
const SnackbarContext = createContext(null as any);

// const SnackbarContext = createContext(
// 	null as [SnackbarType, Dispatch<SetStateAction<SnackbarType>>] | null
// );

export default SnackbarContext;
