import { useState } from 'react';

import { toast } from 'react-toastify';
import { Button, Spinner, Textfield } from 'xtreme-ui';

import './passwordSettings.scss';

const PasswordSettings = () => {
	const [loading, setLoading] = useState(false);

	const [passwordShake, setPasswordShake] = useState(false);
	const [confPasswordShake, setConfPasswordShake] = useState(false);

	const [authenticated, setAuthenticated] = useState(false);

	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newConfPassword, setNewConfPassword] = useState('');

	const onClear = () => {
		setAuthenticated(false);
		setPassword('');
		setNewPassword('');
		setNewConfPassword('');
	};
	const onSave = async () => {
		if (!authenticated) {
			toast.error('Failed to change password');
			return onClear();
		}
		if (!newPassword) {
			return toast.warn('New password is required');
		}
		if (!newConfPassword) {
			return toast.warn('Confirm new password is required');
		}
		if (newPassword !== newConfPassword) {
			setConfPasswordShake(true);
			setTimeout(() => setConfPasswordShake(false), 600);
			return toast.warn('New and Confirm password should match');
		}

		setLoading(true);

		const req = await fetch('/api/admin/password/change', {
			method: 'POST',
			body: JSON.stringify({ password, newPassword }),
		});
		const res = await req.json();

		if (res?.status === 200) toast.success(res?.message);
		else toast.error(res?.message);

		setAuthenticated(false);
		setPassword('');
		setNewPassword('');
		setNewConfPassword('');
		setLoading(false);
	};
	const onPasswordKeyPress = async () => {
		if (!authenticated) {
			setLoading(true);
			const req = await fetch('/api/admin/password/check', {
				method: 'POST',
				body: JSON.stringify({ password }),
			});
			const res = await req.json();

			if (res?.status === 200) setAuthenticated(true);
			else {
				setPasswordShake(true);
				setTimeout(() => setPasswordShake(false), 600);
				toast.error(res?.message);
			}
			setLoading(false);
		}
	};
	const onNewPasswordKeyPress = () => {
		if (authenticated) onSave();
	};
	return (
		<div className='passwordSettings'>
			<div className='passwordHeader'>
				<h1 className='heading'>Change <span>Password</span></h1>
				{
					authenticated
					&& <div className='action'>
						<Button
							className='clear'
							type='secondaryDanger'
							icon='f00d'
							iconType='solid'
							disabled={loading}
							onClick={onClear}
						/>
						<Button className='save' icon='f00c' iconType='solid' label='Change' loading={loading} onClick={onSave} />
					</div>
				}
			</div>
			<div className='passwordFields'>
				{
					loading ? <Spinner className='spinner' label='Authenticating...' fullpage />
						:
						(
							!authenticated ?
								<Textfield
									className={`password ${passwordShake ? 'shake' : ''}`}
									placeholder='Enter your password'
									type='password'
									onEnterKey={onPasswordKeyPress}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								: <>
									<Textfield
										className={`newPassword ${passwordShake ? 'shake' : ''}`}
										placeholder='Enter new password'
										type='password'
										onEnterKey={onNewPasswordKeyPress}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>

									<Textfield
										className={`newConfPassword ${confPasswordShake ? 'shake' : ''}`}
										placeholder='Enter confirm password'
										type='password'
										onEnterKey={onNewPasswordKeyPress}
										value={newConfPassword}
										onChange={(e) => setNewConfPassword(e.target.value)}
									/>
								</>
						)
				}
			</div>
		</div>
	);
};

export default PasswordSettings;
