import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Avatar, Button, Lottie, Textfield } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';
import { TProfile } from '#utils/database/models/profile';

import './loginSection.scss';

const LoginSection = (props) => {
	const session = useSession();
	const [heading, setHeading] = useState('Login');
	const [greeting, setGreeting] = useState('');
	const [logoutLoading, setLogoutLoading] = useState(false);

	const [profile, setProfile] = useState<TProfile>();

	const [email, setEmail] = useState('');
	const [emailShake, setEmailShake] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordShake, setPasswordShake] = useState(false);

	const [nextLabel, setNextLabel] = useState('Next');
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const onNext = async () => {
		if (!profile) {
			const res = await fetch(`/api/getBasicProfile?email=${email}`);
			const profile = await res.json();

			if (profile.status === 404) {
				toast.error('Account does not exist!');
				setEmailShake(true);
				return setTimeout(() => setEmailShake(false), 600);
			}

			setProfile(profile);
		}
	};
	const logout = () => {
		setLogoutLoading(true);
		signOut();
	};

	return (
		<section className='loginSection' id='homepage-login'>
			<div className='loginAnim'>
				<Lottie className='welcomeAnim' src={getAnimSrc('Welcome')} speed={0.6} />
			</div>
			<div className={`loginContainer ${profile ? 'profile' : ''}`}>
				<div className='loginCard front'>
					<h3>{heading}</h3>
					<h4>{greeting}</h4>
					{
						session.status !== 'authenticated' &&
						<div className='inputContainer'>
							<Textfield
								className={`email ${emailShake ? 'shake' : ''}`}
								icon='f0e0'
								placeholder='Enter your email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Textfield
								type='password'
								className={`password ${passwordShake ? 'shake' : ''}`}
								placeholder='Enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					}
					<div className='loginAction'>
						{
							session.status !== 'authenticated'
								? <Button className='next' label={nextLabel} onClick={onNext} loading={loading} />
								: <>
									<Button className='logout' label='Logout' type='secondaryDanger' loading={logoutLoading} onClick={logout} />
									<Button className={`continue ${session === 'kitchen' ? 'kitchen' : ''}`}
										label={session === 'admin' ? 'Dashboard' : 'Kitchen'}
										onClick={() => router.push('/dashboard')}
									/>
								</>
						}
					</div>
				</div>
				<div className='loginCard back'>
					<div className='header'>
						<Avatar src={profile?.avatar ?? ''} size='mini' />
						<div className='details'>
							<p className='name'>{profile?.name}</p>
							<p className='address'>{profile?.address}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginSection;
