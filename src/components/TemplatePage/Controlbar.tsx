import { Stack, Tooltip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "../../styles/classes";
import { useNavigate } from "react-router-dom";
import { useThemeState } from "../../states/ThemeState";
import { useTemplatePageState } from "./TemplatePageState";

function Controlbar() {
	const templatePageState = useTemplatePageState();
	const theme = useThemeState();
	const classes = useStyles();
	const navigate = useNavigate();

	const handleSaveTemplateAction = async () => {
		if (await templatePageState.handleSaveTemplate()) navigate(-1);
	};

	return (
		<Stack
			direction='row'
			sx={{
				position: "fixed",
				width: "100%",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<Stack
				direction='row'
				className={classes.controlMenuBar}
				sx={{
					background: theme.paperBackground,
					transition: theme.transition
				}}
			>
				{/* Add Exercise Btn */}
				<Tooltip title='Add Exercise'>
					<IconButton size='small' onClick={templatePageState.handleOpenDialog}>
						<AddIcon className={classes.blueCircleBtn} fontSize='small' />
					</IconButton>
				</Tooltip>
				{/* Cancel Btn */}
				<Tooltip title='Cancel'>
					<IconButton size='small' onClick={() => navigate(-1)}>
						<CloseIcon className={classes.redCircleBtn} fontSize='small' />
					</IconButton>
				</Tooltip>
				{/* Save Template Btn */}
				<Tooltip title='Save'>
					<IconButton size='small' onClick={handleSaveTemplateAction}>
						<CheckIcon className={classes.greenCircleBtn} fontSize='small' />
					</IconButton>
				</Tooltip>
			</Stack>
		</Stack>
	);
}

export default Controlbar;
