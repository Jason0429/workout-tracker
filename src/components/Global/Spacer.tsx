import React from "react";

type Props = {
	width?: string;
	height?: string;
};

function Spacer({ width, height }: Props) {
	return (
		<div
			style={{
				width: `${width || "auto"}`,
				height: `${height || "auto"}`
			}}
		></div>
	);
}

export default Spacer;
