import { useHookstate } from "@hookstate/core";
import { Navigate, Route } from "react-router-dom";
import { globalUser } from "../../states/user.state";

interface Props {
	path: string;
	element: JSX.Element;
}

function ProtectedRoute({ path, element }: Props) {
	const user = useHookstate(globalUser);

	return <Route path={path} element={user ? element : <Navigate to={"/signin"} />} />;
}

export default ProtectedRoute;
