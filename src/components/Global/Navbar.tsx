// React
import { useState } from "react";
import { NavLink } from "react-router-dom";

// Material
import {
	Paper,
	Stack,
	Avatar,
	Menu,
	MenuItem,
	ListItemIcon,
	IconButton,
	Typography
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import BoyIcon from "@mui/icons-material/Boy";
import AddIcon from "@mui/icons-material/Add";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FirebaseObject from "../../firebase/firebase";
import { themes } from "../../styles/theme";
import { useHookstate } from "@hookstate/core";
import { globalUser } from "../../states/UserState";
import { globalTheme } from "../../states/ThemeState";

function Navbar() {
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const openMenu = Boolean(anchorEl);
	/**
	 * Handles opening the menu.
	 * @param e
	 */
	function handleOpen(e: React.MouseEvent) {
		setAnchorEl(e.target);
	}

	/**
	 * Handles closing the menu.
	 */
	function handleClose() {
		setAnchorEl(null);
	}

	/**
	 * Handles sign out with google.
	 */
	function handleSignOutUser() {
		const firebaseObj = new FirebaseObject();
		firebaseObj.logout();
	}

	/**
	 * Handles theme toggling.
	 */
	function handleToggleTheme() {
		if (theme.mode.value === "light") {
			theme.set(themes.dark);
			localStorage.setItem("themeMode", "dark");
		} else {
			theme.set(themes.light);
			localStorage.setItem("themeMode", "light");
		}
	}

	return (
		<Paper
			variant='outlined'
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				height: "50px",
				width: "100%",
				zIndex: 100,
				background: theme.paperBackground.value,
				transition: theme.transition.value
			}}
		>
			<Stack
				direction='row'
				sx={{
					justifyContent: "center",
					height: "100%"
				}}
			>
				<Stack
					direction='row'
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
						height: "100%",
						width: "90%"
					}}
				>
					<Typography
						sx={{
							color: theme.text.value,
							transition: theme.transition.value
						}}
					>
						{user.value?.name ?? "Workout Tracker"}
					</Typography>
					{user.value && (
						<IconButton onClick={handleOpen} size='small' className='mui-fixed'>
							<Avatar sx={{ width: 35, height: 35 }} src={user.value.photoURL!} />
						</IconButton>
					)}
					<Menu
						anchorEl={anchorEl}
						open={openMenu}
						onClose={handleClose}
						onClick={handleClose}
						transformOrigin={{ horizontal: "right", vertical: "top" }}
						anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					>
						<MenuItem onClick={handleToggleTheme}>
							<ListItemIcon>
								{theme.mode.value === "light" ? (
									<Brightness4Icon fontSize='small' />
								) : (
									<Brightness7Icon fontSize='small' />
								)}
							</ListItemIcon>
							{theme.mode.value === "light" ? "View Dark Mode" : "View Light Mode"}
						</MenuItem>
						<MenuItem component={NavLink} to='/home'>
							<ListItemIcon>
								<HomeIcon fontSize='small' />
							</ListItemIcon>
							Home
						</MenuItem>
						<MenuItem component={NavLink} to='/createTemplate'>
							<ListItemIcon>
								<AddIcon fontSize='small' />
							</ListItemIcon>
							Create Template
						</MenuItem>
						<MenuItem component={NavLink} to='/progress'>
							<ListItemIcon>
								<SignalCellularAltIcon fontSize='small' />
							</ListItemIcon>
							View Progress
						</MenuItem>
						<MenuItem component={NavLink} to='/log'>
							<ListItemIcon>
								<FitnessCenterIcon fontSize='small' />
							</ListItemIcon>
							Log Workout
						</MenuItem>
						<MenuItem component={NavLink} to='/exercises'>
							<ListItemIcon>
								<BoyIcon fontSize='small' />
							</ListItemIcon>
							My Exercises
						</MenuItem>
						<MenuItem onClick={handleSignOutUser}>
							<ListItemIcon>
								<LogoutOutlined fontSize='small' />
							</ListItemIcon>
							Logout
						</MenuItem>
					</Menu>
				</Stack>
			</Stack>
		</Paper>
	);
}

export default Navbar;
