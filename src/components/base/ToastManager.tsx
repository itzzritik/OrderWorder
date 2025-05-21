import { ToastContainer } from 'react-toastify';
import { useXTheme } from 'xtreme-ui';

export const ToastManager = () => {
	const { themeScheme } = useXTheme();

	return (
		<ToastContainer position='top-center' theme={themeScheme === 'light' ? 'light' : 'dark'} />
	);
};
