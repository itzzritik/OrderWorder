import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Button, Lottie, Textfield } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';

import './loginSection.scss';

const LoginSection = (props) => {
	const session = useSession();
	const [heading, setHeading] = useState('Login');
	const [greeting, setGreeting] = useState('');
	const [logoutLoading, setLogoutLoading] = useState(false);

	const emailRef = useRef<HTMLInputElement>(null);
	const [email, setEmail] = useState('');
	const [emailShake, setEmailShake] = useState(false);

	const passwordRef = useRef<HTMLInputElement>(null);
	const [password, setPassword] = useState('');
	const [passwordShake, setPasswordShake] = useState(false);

	const [nextLabel, setNextLabel] = useState('Next');
	const [loading, setLoading] = useState(false);
	const [stage, setStage] = useState('check');

	const router = useRouter();

	// const setNewGreeting = (value?: string) => {
	// 	const greetings = ['Glad to see you are here', 'Welcome back foodie'];
	// 	if (value) {
	// 		return setGreeting(value);
	// 	}

	// 	return setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
	// };

	// const resetLogin = () => {
	// 	setPassword('');
	// 	setNewGreeting();
	// 	setStage('check');
	// 	setHeading('Login');
	// 	setNextLabel('Next');
	// 	setTimeout(() => emailRef?.current?.focus(), 200);
	// };
	// const onNext = () => {
	// 	if (stage !== 'check' && !password) {
	// 		toast.error('Password cannot be empty!');
	// 		setPasswordShake(true);
	// 		return setTimeout(() => setPasswordShake(false), 600);
	// 	}

	// 	if (stage === 'check') {
	// 		setLoading(true);
	// 		Meteor.call('checkUserExists', email, (err, userData) => {
	// 			setLoading(false);

	// 			// Error occurred at server side
	// 			if (err) {
	// 				setEmailShake(true);
	// 				setTimeout(() => setEmailShake(false), 600);
	// 				return console.log(err);
	// 			}

	// 			// User does not exist
	// 			if (!userData) {
	// 				toast.error('User does not exist!');
	// 				setEmailShake(true);
	// 				return setTimeout(() => setEmailShake(false), 600);
	// 			}

	// 			setHeading('Hi!');
	// 			setNewGreeting('Happy to see you back');
	// 			setStage('login');
	// 			setNextLabel('Login');
	// 			setTimeout(() => passwordRef.current.focus(), 200);
	// 		});
	// 	} else if (stage === 'login') {
	// 		setLoading(true);
	// 		Meteor.loginWithPassword(email, password, (err) => {
	// 			setLoading(false);

	// 			if (err) {
	// 				toast.error('Incorrect Password!');
	// 				setPasswordShake(true);
	// 				return setTimeout(() => setPasswordShake(false), 600);
	// 			}

	// 			history.replace('/dashboard');
	// 		});
	// 	}
	// };
	const logout = () => {
		setLogoutLoading(true);
		signOut();
	};

	// useEffect(() => {
	// 	setNewGreeting();
	// 	if (session.status === 'authenticated') {
	// 		setHeading('Welcome Back!');
	// 		if (props.user.role === 'admin') {
	// 			setNewGreeting(props?.user?.emails?.[0].address);
	// 		} else {
	// 			setNewGreeting(props?.user?.username);
	// 		}
	// 	} else {
	// 		setHeading('Login');
	// 		setNewGreeting();
	// 	}
	// }, [session]);

	return (
		<section className='loginSection' id='homepage-login'>
			<div className='loginAnim'>
				<Lottie className='welcomeAnim' src={getAnimSrc('Welcome')} speed={0.6} />
			</div>
			<div className='loginContainer'>
				<div className={`loginCard ${stage} ${session.status === 'authenticated' ? 'loggedIn' : ''}`}>
					<h3>{heading}</h3>
					<h4>{greeting}</h4>
					{
						session.status !== 'authenticated' &&
						<div className='inputContainer'>
							<Textfield
								ref={emailRef}
								className={`email ${emailShake ? 'shake' : ''}`}
								icon='f0e0'
								placeholder='Enter your email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Textfield
								ref={passwordRef}
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
								? <Button className='next' label={nextLabel} onClick={() => {}} loading={loading} />
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
			</div>
		</section>
	);
};

export default LoginSection;
