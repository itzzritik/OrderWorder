import { useState } from 'react';

import { toast } from 'react-toastify';

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
	const onSave = () => {
		if (!authenticated) {
			toast.error('Failed to change password');
			return onClear();
		}
		if (!newPassword) {
			return toast.warn('Please enter a new password');
		}
		if (!newConfPassword) {
			return toast.warn('Please enter a confirm new password');
		}
		if (newPassword !== newConfPassword) {
			setConfPasswordShake(true);
			setTimeout(() => setConfPasswordShake(false), 600);
			return toast.warn('Confirm password should be same as new password');
		}

		setLoading(true);
		Accounts.changePassword(password, newPassword, (err) => {
			setLoading(false);

			if (err) {
				console.log(err);
				return toast.error('Failed to change password');
			}

			toast.success('Password successfully changed');
			onClear();
		});
	};
	const onPasswordKeyPress = (event) => {
		if (event.key === 'Enter' && !authenticated) {
			const digest = sha256(password);
			Meteor.call('checkPassword', digest, function (err, correctPassword) {
				if (err) {
					console.log(err);
					return toast.error('Unexpected error occurred');
				}

				if (!correctPassword) {
					setPasswordShake(true);
					setTimeout(() => setPasswordShake(false), 600);
					return toast.error('Incorrect Password');
				}

				setAuthenticated(true);
			});
		}
	};
	const onNewPasswordKeyPress = (event) => {
		if (event.key === 'Enter' && authenticated) {
			onSave();
		}
	};
	return (
		<div className='passwordSettings'>
			<div className='passwordHeader'>
				<h1 className='heading'>Change <span>Password</span></h1>
				{
					authenticated
					&& <div className='action'>
						<IconButton className='clear' icon='/icons/Base/cross.svg' onClick={onClear} />
						<IconButton className='save' loading={loading} active onClick={onSave}
							icon='/icons/Base/tick.svg'
						/>
					</div>
				}
			</div>
			<div className='passwordFields'>
				{
					!authenticated
						? <TextInput className={`password ${passwordShake ? 'shake' : ''}`}
								placeholder='Enter your password' value={password} setValue={setPassword}
								onKeyPress={onPasswordKeyPress} icon={'/icons/Base/password.svg'} password
						  />
						: <>
							<TextInput className={`newPassword ${passwordShake ? 'shake' : ''}`}
								placeholder='Enter new password' value={newPassword} setValue={setNewPassword}
								onKeyPress={onNewPasswordKeyPress} icon={'/icons/Base/password.svg'} password
							/>

							<TextInput className={`newConfPassword ${confPasswordShake ? 'shake' : ''}`}
								placeholder='Enter confirm password' value={newConfPassword} setValue={setNewConfPassword}
								onKeyPress={onNewPasswordKeyPress} icon={'/icons/Base/password.svg'} password
							/>
						</>
				}
			</div>
		</div>
	);
};

export default PasswordSettings;
