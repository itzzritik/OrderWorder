import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Avatar, Button, Lottie, Textfield } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';
import { TProfile } from '#utils/database/models/profile';

import './loginSection.scss';

const LoginSection = () => {
	const session = useSession();
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

	const router = useRouter();
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
			const res = await signIn('credentials', {
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
			}
		}
		setNextLoading(false);
	};
	const logout = () => {
		if (!loggedIn) return setProfile(undefined);
		setLogoutLoading(true);
		signOut();
	};

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
						<Avatar src={profile?.avatar ?? session.data?.profile?.avatar ?? ''} size='mini' />
						<div className='details'>
							<p className='name'>{profile?.name ?? session.data?.profile?.name}</p>
							<p className='address'>{profile?.address ?? session.data?.profile?.address}</p>
						</div>
						<Button className='logout' icon={loggedIn ? 'f011' : 'f304'} size='mini' onClick={logout} loading={logoutLoading} />
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
										className='dashboard'
										label='open dashboard'
										icon='e323'
										size='mini'
										onClick={() => router.push('/dashboard')}
									/>
								}
								<Button className='kitchen' label='open kitchen' icon='f86b' size='mini' onClick={() => router.push('/kitchen')} />
							</div>
					}

				</div>
			</div>
		</section>
	);
};

export default LoginSection;
