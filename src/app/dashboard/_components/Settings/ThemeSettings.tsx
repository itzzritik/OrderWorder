import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { Spinner, Button, ThemePicker, useXTheme, isValidThemeColor, isEqual, useScreenType, ThemeSelect } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';

import './themeSettings.scss';

const ThemeSettings = () => {
	const { profile, profileMutate } = useAdmin();
	const { themeColor, setThemeColor } = useXTheme();
	const { isMobile } = useScreenType({
		mobile: '(max-width: 779px)',
	});

	const [loading, setLoading] = useState(false);

	const onClear = () => {
		if (isValidThemeColor(profile?.themeColor)) setThemeColor(profile?.themeColor);
	};

	const onSave = async () => {
		setLoading(true);
		const req = await fetch('/api/admin/theme', {
			method: 'POST',
			body: JSON.stringify({ themeColor }),
		});
		const res = await req.json();
		if (res?.status !== 200) toast.error(res?.message);
		await profileMutate();
		setLoading(false);
	};

	return (
		<div className='themeSettings'>
			<div className='colorHeader'>
				<h1 className='heading'>Theme <span>Color</span></h1>
				{
					!isEqual(profile?.themeColor, themeColor)
					&& <div className='action'>
						<Button
							className='clear'
							type='secondaryDanger'
							icon='f00d'
							iconType='solid'
							disabled={loading}
							onClick={onClear}
						/>
						<Button className='save' icon='f00c' iconType='solid' label='Apply' loading={loading} onClick={onSave} />
					</div>
				}
			</div>
			<div className='colorPickerWrapper'>
				{
					loading
						? <Spinner className='spinner' label='Applying theme' fullpage />
						: isMobile ? <ThemeSelect size='default' withSwatch withScheme /> : <ThemePicker />
				}
			</div>
		</div>
	);
};

export default ThemeSettings;
