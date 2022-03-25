import { useHookstate } from "@hookstate/core";
import { Navigate } from "react-router-dom";
import { globalUser } from "../../states/user.state";

interface Props {
	element: any;
}

function ProtectedRoute({ element }: Props) {
	const user = useHookstate(globalUser);

	return user.value ? element : <Navigate to={"/signin"} />;
}

export default ProtectedRoute;
