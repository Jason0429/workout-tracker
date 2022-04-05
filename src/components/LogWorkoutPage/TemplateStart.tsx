import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Stack,
	Typography,
	IconButton,
	Divider,
	Menu,
	MenuItem,
	ListItemIcon,
	Paper
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { TemplateType, deleteTemplate } from "../../firebase/Template";
import { useThemeState } from "../../states/ThemeState";
import { useSnackbarState } from "../../states/SnackbarState";

interface Props {
	template: TemplateType;
}

function TemplateStart({ template }: Props) {
	const theme = useThemeState();
	const snackbar = useSnackbarState();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const openMenu = Boolean(anchorEl);
	const MAX_NUMBER_OF_DISPLAYABLE_EXERCISES = 4;

	const renderExerciseNames = () => {
		let toRender = [];

		for (let i = 0; i < template.exercises.length; i++) {
			if (i >= MAX_NUMBER_OF_DISPLAYABLE_EXERCISES) {
				toRender.push("...");
				return toRender;
			} else {
				toRender.push(template.exercises[i].name);
			}
		}

		return toRender;
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	/**
	 * Handles deleting template from database.
	 * @param template template to be deleted.
	 */
	const handleDeleteTemplate = async (template: TemplateType) => {
		const t = { ...template };
		try {
			await deleteTemplate(template.id);
			snackbar.handleOpenSnackbar(`Template: ${t.name} has been successfully deleted.`);
		} catch (e) {
			alert("Something went wrong.");
			snackbar.handleOpenSnackbar(
				`Something went wrong. Template: ${t.name} could not be deleted.`
			);
		}
	};

	return (
		<Paper
			variant='outlined'
			sx={{
				padding: "4px 10px",
				width: "250px",
				height: "150px",
				position: "relative",
				cursor: "pointer",
				background: theme.paperBackground
			}}
		>
			<Stack
				direction='column'
				spacing={0}
				divider={<Divider orientation='horizontal' flexItem />}
				onClick={() => navigate(`/logWorkout/${template.id}`)}
			>
				{/* Template Name */}
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Typography variant='subtitle1' sx={{ fontWeight: "bold", color: theme.text }}>
						{template.name}
					</Typography>
				</Stack>

				{/* Render exercises */}
				<Stack direction='column' spacing={0} pt={1} pb={1}>
					{renderExerciseNames().map((exerciseName: string, idx: number) => (
						<Typography
							variant='caption'
							noWrap
							sx={{ width: "90%", color: theme.text }}
							key={idx}
						>
							{exerciseName}
						</Typography>
					))}
				</Stack>
			</Stack>
			<IconButton
				size='small'
				onClick={(e) => setAnchorEl(e.target)}
				style={{
					zIndex: 10,
					position: "absolute",
					right: 0,
					top: 0
				}}
			>
				<MoreVertIcon
					sx={{
						color: theme.text
					}}
				/>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={openMenu}
				onClose={handleCloseMenu}
				onClick={handleCloseMenu}
				transformOrigin={{
					horizontal: "right",
					vertical: "top"
				}}
				anchorOrigin={{
					horizontal: "right",
					vertical: "bottom"
				}}
			>
				{/* Edit Template */}
				<MenuItem onClick={() => navigate(`/editTemplate/${template.id}`)}>
					<ListItemIcon>
						<EditIcon fontSize='small' />
					</ListItemIcon>
					<Typography>Edit</Typography>
				</MenuItem>
				{/* Delete Template */}
				<MenuItem onClick={() => handleDeleteTemplate(template)}>
					<ListItemIcon>
						<DeleteForeverIcon fontSize='small' style={{ color: "#ff726f" }} />
					</ListItemIcon>
					<Typography color='#ff726f'>Delete</Typography>
				</MenuItem>
			</Menu>
		</Paper>
	);
}

export default TemplateStart;
