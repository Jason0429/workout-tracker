import { Stack, Tooltip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { useStyles } from "../../styles/classes";
import { useNavigate } from "react-router-dom";
import { handleOpenDialog, handleSaveTemplate } from "../../states/TemplatePage.state";

function Controlbar() {
	const theme = useHookstate(globalTheme);
	const classes = useStyles();
	const navigate = useNavigate();

	const handleSaveTemplateAction = async () => {
		if (await handleSaveTemplate()) navigate(-1);
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
					background: theme.paperBackground.value,
					transition: theme.transition.value
				}}
			>
				{/* Add Exercise Btn */}
				<Tooltip title='Add Exercise'>
					<IconButton size='small' onClick={handleOpenDialog}>
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
