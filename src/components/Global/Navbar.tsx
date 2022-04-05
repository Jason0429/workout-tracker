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
import { useUserState } from "../../states/UserState";
import { useThemeState } from "../../states/ThemeState";

function Navbar() {
	const user = useUserState();
	const theme = useThemeState();
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
				background: theme.paperBackground,
				transition: theme.transition
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
							color: theme.text,
							transition: theme.transition
						}}
					>
						{user?.name ?? "Workout Tracker"}
					</Typography>
					{user.photoURL && (
						<IconButton onClick={handleOpen} size='small' className='mui-fixed'>
							<Avatar sx={{ width: 35, height: 35 }} src={user.photoURL} />
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
						<MenuItem onClick={theme.toggleTheme}>
							<ListItemIcon>
								{theme.mode === "light" ? (
									<Brightness4Icon fontSize='small' />
								) : (
									<Brightness7Icon fontSize='small' />
								)}
							</ListItemIcon>
							{theme.mode === "light" ? "View Dark Mode" : "View Light Mode"}
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
