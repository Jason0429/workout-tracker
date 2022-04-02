import { Navigate } from "react-router-dom";
import { useUserState } from "../../states/UserState";

interface Props {
	element: any;
}

function ProtectedRoute({ element }: Props) {
	const user = useUserState();

	return user ? element : <Navigate to={"/signin"} />;
}

export default ProtectedRoute;
