// Material
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from "@mui/material";

interface Props {
	open: boolean;
	onClose: () => any;
	title: any;
	message: any;
	yesFunction: () => any;
}

function ConfirmationDialog({ open, onClose, title, message, yesFunction }: Props) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant='outlined' onClick={yesFunction}>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationDialog;
