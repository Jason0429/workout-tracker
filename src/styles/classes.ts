import { ThemeType } from "./../models";
import { makeStyles } from "@mui/styles";

export const lightBlue = "#00bfff30";
export const darkBlue = "#00bfff";
export const lightGreen = "#66ff0030";
export const darkGreen = "#52cc00";
export const lightRed = "#ffcccb50";
export const darkRed = "#ff726f";
export const lightGray = "#cecece";
export const darkGray = "#00000090";

export const useStyles = makeStyles((theme: ThemeType) => ({
	blueBtn: {
		fontWeight: "bold",
		fontSize: "1em",
		width: "fit-content",
		padding: "8px 30px",
		background: lightBlue,
		color: darkBlue,
		textAlign: "center",
		borderRadius: "5px",
		cursor: "pointer",
		textDecoration: "none",
		border: "none",
		"&:focus": {
			outline: "none"
		}
	},
	greenBtn: {
		fontWeight: "bold",
		fontSize: "1em",
		width: "fit-content",
		padding: "8px 30px",
		background: lightGreen,
		color: darkGreen,
		textAlign: "center",
		borderRadius: "5px",
		cursor: "pointer",
		textDecoration: "none",
		border: "none",
		"&:focus": {
			outline: "none"
		}
	},
	mainContainer: {
		position: "relative",
		minHeight: "100vh",
		width: "100%",
		display: "flex",
		justifyContent: "center",
		// Extra bottom padding
		paddingBottom: "50px",
		// Avoid navbar
		paddingTop: "50px"
	},
	roundInputField: {
		width: "100%",
		border: "1px solid #00000020",
		fontSize: "1em",
		borderRadius: "15px",
		padding: "10px 15px",
		outline: "none",
		boxSizing: "border-box",
		"&:focus": {
			outline: "none"
		}
	},
	setNumber: {
		fontWeight: "bold",
		fontSize: "0.9em",
		width: "50px",
		textAlign: "center"
	},
	setDetailInput: {
		width: "50px"
	},
	closeIconContainer: {
		cursor: "pointer",
		width: "40px",
		background: "#00000020",
		borderRadius: "5px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	closeIcon: {
		transform: "scale(0.8)",
		color: "#00000080"
	},
	exerciseSubmitBtn: {
		background: darkBlue,
		borderBottom: "1.5px solid gray",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flex: 0.1,
		cursor: "pointer",
		color: lightBlue
	},
	sendIcon: {
		position: "absolute",
		right: "10px",
		zIndex: 2,
		cursor: "pointer"
	},
	list: {
		paddingTop: 0,
		height: "80vh"
	},
	exerciseTemplateHeader: {
		fontWeight: "bold",
		fontSize: "1em"
	},
	exerciseTemplateSubHeader: {
		fontWeight: "bold",
		fontSize: "0.9em",
		width: "50px",
		textAlign: "center"
	},
	exerciseTemplateSpacer: {
		width: "40px"
	},
	redXBtn: {
		fontWeight: "bold",
		height: "25px",
		width: "40px",
		borderRadius: "5px",
		background: lightRed,
		color: darkRed,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",

		"&:hover": {
			color: "#ff726f80"
		}
	},
	grayBtn: {
		background: lightGray,
		color: darkGray,
		fontWeight: "bold",
		fontSize: "0.9em",
		borderRadius: "5px",
		padding: "5px",
		textAlign: "center",
		cursor: "pointer",

		"&:hover": {
			color: "#00000060"
		}
	},
	exerciseTemplateSpacerRow: {
		width: "100%"
	},
	controlMenuBar: {
		width: "350px",
		position: "fixed",
		bottom: "0",
		borderRadius: "15px 15px 0 0",
		height: "50px",
		justifyContent: "space-around",
		alignItems: "center"
	},
	blueCircleBtn: {
		height: "50px",
		width: "50px",
		padding: "5px",
		// boxSizing: "border-box",
		borderRadius: "100%",
		background: lightBlue,
		color: darkBlue,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer"
	},
	redCircleBtn: {
		height: "50px",
		width: "50px",
		padding: "5px",
		// boxSizing: "border-box",
		borderRadius: "100%",
		background: lightRed,
		color: darkRed,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer"
	},
	greenCircleBtn: {
		height: "50px",
		width: "50px",
		padding: "5px",
		// boxSizing: "border-box",
		borderRadius: "100%",
		background: lightGreen,
		color: darkGreen,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer"
	},
	navLink: {
		height: "100%",
		width: "100%"
	}
}));
