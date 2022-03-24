import { Stack, styled } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../states/themeState";

function HomePage() {
	const theme = useHookstate(globalTheme);

	const MyNavLink = styled(NavLink)`
		background: ${theme.value.paperBackground};
		border-radius: 20px;
		padding: 10px;
		width: 200px;
		text-align: center;
		text-decoration: none;
		color: ${theme.value.text};

		&:hover {
			background: ${theme.value.paperBackgroundHover};
		}
	`;

	return (
		<Stack
			direction='column'
			spacing={3}
			justifyContent='center'
			alignItems='center'
			height='100vh'
		>
			<MyNavLink to='/createTemplate'>Create Template</MyNavLink>
			<MyNavLink to='/progress'>View Progress</MyNavLink>
			<MyNavLink to='/exercises'>My Exercises</MyNavLink>
			<MyNavLink to='/log'>Log Workout</MyNavLink>
		</Stack>
	);
}

export default HomePage;
