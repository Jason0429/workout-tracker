import { Stack, Typography } from '@mui/material';
import { TemplateType } from '../../firebase/Template';
import { UserType } from '../../firebase/User';
import { useWindowSize } from '../../hooks';
import { useThemeState } from '../../states/ThemeState';
import { useUserState } from '../../states/UserState';
import TemplateStart from './TemplateStart';

function TemplateStartContainer() {
	const [width] = useWindowSize();
	const user = useUserState() as UserType;
	const theme = useThemeState();
	return (
		<Stack
			direction='row'
			gap={2}
			style={{
				flexWrap: 'wrap',
				width: '100%',
				alignItems: `${width > 400 ? '' : 'center'}`,
				justifyContent: `${width > 400 ? '' : 'center'}`
			}}>
			{/* Render Templates Section */}
			{user.templates.length === 0 ? (
				<Typography
					style={{
						color: theme.text,
						transition: theme.transition
					}}>
					You currently have no templates.
				</Typography>
			) : (
				user.templates
					.map((t) => t)
					.sort((a: TemplateType, b: TemplateType) =>
						a.name.localeCompare(b.name)
					)
					.map((template: TemplateType, idx: number) => (
						<TemplateStart key={idx} template={template} />
					))
			)}
		</Stack>
	);
}

export default TemplateStartContainer;
