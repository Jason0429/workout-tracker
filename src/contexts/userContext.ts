import { createContext } from "react";

// Default value for user is null.
const UserContext = createContext(null as any);
// const UserContext = createContext(
// 	null as
// 		| [UserType | null, Dispatch<SetStateAction<UserType>> | Dispatch<SetStateAction<null>>]
// 		| null
// );

export default UserContext;
