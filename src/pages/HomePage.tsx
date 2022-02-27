import { useContext } from "react";
import styled from "@mui/styled-engine";
import { Stack } from "@mui/material";
// import { useAppSelector } from "../../app/hooks";
import { NavLink } from "react-router-dom";
import ThemeContext from "../contexts/themeContext";
import { ThemeStateType } from "../models";

function HomePage() {
	// const theme = useAppSelector((state) => state.theme);
	const [theme] = useContext(ThemeContext) as ThemeStateType;

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
