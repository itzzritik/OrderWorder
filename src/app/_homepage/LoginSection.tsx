import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Avatar, Button, defaultColorPreset, Lottie, Textfield, useXTheme } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';
import { DEFAULT_THEME_COLOR, getAnimSrc } from '#utils/constants/common';
import { TProfile } from '#utils/database/models/profile';

import './loginSection.scss';

const LoginSection = () => {
	const { setThemeColor } = useXTheme();
	const router = useRouter();
	const session = useSession();
	const { profile: dashboard, profileLoading } = useAdmin();
	const loggedIn = session.status === 'authenticated';

	const [logoutLoading, setLogoutLoading] = useState(false);

	const [profile, setProfile] = useState<TProfile>();
	const [nextLoading, setNextLoading] = useState(false);

	const [email, setEmail] = useState('');
	const [emailShake, setEmailShake] = useState(false);

	const [kitchenUsername, setKitchenUsername] = useState('');
	const [showKitchen, setShowKitchen] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordShake, setPasswordShake] = useState(false);

	const onNext = async () => {
		setNextLoading(true);
		if (!profile) {
			const res = await fetch(`/api/baseProfile?email=${email}`);
			const profile = await res.json();

			if (profile.status === 404) {
				toast.error('Account does not exist!');
				setEmailShake(true);
				setTimeout(() => setEmailShake(false), 600);
			}
			else {
				setProfile(profile);
			}
		}
		else {
			const res = await signIn('restaurant', {
				redirect: false,
				username: email,
				...(showKitchen && { kitchen: kitchenUsername }),
				password,
				callbackUrl: `${window.location.origin}`,
			});

			if (res?.error) {
				toast.error(res?.error);
				setPassword('');
				setPasswordShake(true);
				setTimeout(() => setPasswordShake(false), 600);
				return setNextLoading(false);
			}

			if (kitchenUsername) router.push('/kitchen');
			else router.push('/dashboard');
		}
		setNextLoading(false);
	};
	const logout = () => {
		setThemeColor(DEFAULT_THEME_COLOR)
		if (!loggedIn) return setProfile(undefined);
		setLogoutLoading(true);
		router.push('/logout');
	};

	useEffect(() => {
		const newColor = profile?.themeColor ?? dashboard?.themeColor;
		if (newColor) setThemeColor(profile?.themeColor ?? dashboard?.themeColor);
	}, [profile, dashboard])

	return (
		<section className='loginSection' id='homepage-login'>
			<div className='loginAnim'>
				<Lottie className='welcomeAnim' src={getAnimSrc('Welcome')} speed={0.6} />
			</div>
			<div className={`loginContainer ${profile || loggedIn ? 'profile' : ''}`}>
				<div className='loginCard front'>
					<div className='header'>
						<h3>Login</h3>
						<h4>Please enter credentials</h4>
					</div>
					<div className='inputContainer'>
						<Textfield
							className={`email ${emailShake ? 'shake' : ''}`}
							icon='f0e0'
							placeholder='Enter your email'
							onEnterKey={onNext}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='loginAction'>
						<Button className='next' label='Next' onClick={onNext} loading={nextLoading} />
					</div>
				</div>
				<div className='loginCard back'>
					<div className='header'>
						{
							((session.data?.role === 'admin' || session.data?.role === 'kitchen') && profileLoading)
								? <div className='details'><p className='name'> OrderWorder</p></div>
								: <>
									<Avatar src={profile?.avatar ?? dashboard?.avatar ?? session.data?.restaurant?.avatar ?? ''} size='mini' />
									<div className='details'>
										<p className='name'> {
											profile?.name ?? dashboard?.name ?? `${session.data?.customer?.fname} ${session.data?.customer?.lname}`
										} </p>
										<p className='address'>{profile?.address ?? dashboard?.address ?? session.data?.customer?.phone}</p>
									</div>
									<Button
										className='logout'
										icon={loggedIn ? 'f011' : 'f304'}
										size='mini'
										onClick={logout}
										loading={logoutLoading}
									/>
								</>
						}

					</div>
					{
						!loggedIn
							? <div className='body'>
								<div className='inputContainer'>
									<Textfield
										className={`username ${showKitchen ? 'show' : ''}`}
										icon='f86b'
										placeholder='Enter kitchen username'
										value={kitchenUsername}
										onChange={(e) => setKitchenUsername(e.target.value)}
									/>
									<Textfield
										type='password'
										className={`password ${passwordShake ? 'shake' : ''}`}
										placeholder={`Enter ${showKitchen ? 'kitchen' : 'admin'} password`}
										onEnterKey={onNext}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div className='loginAction'>
									<Button
										className={`kitchenMode ${showKitchen ? 'active' : ''}`}
										type={showKitchen ? 'primary' : 'secondary'}
										label='login to kitchen'
										size='mini'
										onClick={() => setShowKitchen((v) => !v)}
									/>
									<Button className='next' label='Sign In' onClick={onNext} loading={nextLoading} />
								</div>
							</div>
							: <div className='loggedInAction'>
								{
									session.data?.role === 'admin' &&
									<Button
										label='open dashboard'
										icon='e323'
										size='mini'
										onClick={() => router.push('/dashboard')}
									/>
								}
								{
									(session.data?.role === 'admin' || session.data?.role === 'kitchen') &&
									<Button
										label='open kitchen'
										icon='f86b'
										size='mini'
										onClick={() => router.push('/kitchen')}
									/>
								}
								{
									session.data?.role === 'customer' &&
									<Button
										label='open  restaurant menu'
										icon='f86b'
										size='mini'
										onClick={() => router.push(`/${session.data?.restaurant?.username}`)}
									/>
								}
							</div>
					}

				</div>
			</div>
		</section>
	);
};

export default LoginSection;
