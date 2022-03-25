import { useHookstate } from "@hookstate/core";
import React from "react";
import { globalTheme } from "../states/theme.state";
import { useStyles } from "../styles/classes";

function LoadingPage() {
	const classes = useStyles();
	const theme = useHookstate(globalTheme);

	return (
		<div
			className={classes.mainContainer}
			style={{
				background: theme.value.background,
				transition: theme.value.transition,
				color: theme.value.text
			}}
		>
			{"Loading..."}
		</div>
	);
}

export default LoadingPage;
