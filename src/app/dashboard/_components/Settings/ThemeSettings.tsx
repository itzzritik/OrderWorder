import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { ColorPopper, Spinner, type AnyColor, Button } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';
import { TThemeColor } from '#utils/database/models/profile';
import { isEqualColor, isValidRGB } from '#utils/helper/common';

import './themeSettings.scss';

const ThemeSettings = () => {
	const { profile, profileMutate } = useAdmin();
	const [color, setColor] = useState<AnyColor>();
	const [loading, setLoading] = useState(false);

	const onClear = () => {
		setColor(undefined);
		setTimeout(() => setColor(profile?.themeColor), 5);
	};

	const onSave = async () => {
		const localColor = color as TThemeColor;

		if (!isValidRGB(localColor)) toast.error('Something went wrong');

		setLoading(true);

		const req = await fetch('/api/admin/theme', {
			method: 'POST',
			body: JSON.stringify({ themeColor: { r: localColor?.r, g: localColor?.g, b: localColor?.b } }),
		});
		const res = await req.json();

		if (res?.status !== 200) toast.error(res?.message);

		await profileMutate();

		setLoading(false);
	};

	useEffect(() => {
		setColor(undefined);
		setTimeout(() => setColor(profile?.themeColor), 5);
	}, [profile?.themeColor]);

	return (
		<div className='themeSettings'>
			<div className='colorHeader'>
				<h1 className='heading'>Theme <span>Color</span></h1>
				{
					!isEqualColor(profile?.themeColor, color as TThemeColor)
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
			<div className='colorPicker'>
				{
					loading
						? <Spinner className='spinner' label='Applying theme' fullpage />
						: color && <ColorPopper color={color} setColor={setColor} />
				}
			</div>
		</div>
	);
};

export default ThemeSettings;
