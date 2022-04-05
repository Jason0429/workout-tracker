import { Stack, styled } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useThemeState } from "../states/ThemeState";

function HomePage() {
	const theme = useThemeState();

	const MyNavLink = styled(NavLink)`
		background: ${theme.paperBackground};
		border-radius: 20px;
		padding: 10px;
		width: 200px;
		text-align: center;
		text-decoration: none;
		color: ${theme.text};

		&:hover {
			background: ${theme.paperBackgroundHover};
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
