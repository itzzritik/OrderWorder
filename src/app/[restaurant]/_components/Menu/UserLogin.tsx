import { useState, useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Button, Textfield } from 'xtreme-ui';

import './userLogin.scss';

const mobileNumberPattern = /^(\+91[-\s]?)?[6-9]\d{9}$/;
const UserLogin = ({ setOpen }: UserLoginProps) => {
	const pathname = usePathname();
	const params = useSearchParams();
	const [page, setPage] = useState('phone');
	const [buttonLabel, setButtonLabel] = useState('Next');
	const [busy, setBusy] = useState(false);

	const [dialCode] = useState('91');
	const [phone, setPhone] = useState('');

	const [fname, setFName] = useState('');
	const [lname, setLName] = useState('');
	const [heading, setHeading] = useState(['Let\'s', ' start ordering']);

	const phoneNumber = `+${dialCode}${phone}`;
	const onNext = async () => {
		if (page === 'phone') {
			if (!mobileNumberPattern.test(phoneNumber)) {
				return toast.error('Please enter a valid phone number');
			}

			setBusy(true);
			setTimeout(() => {
				setBusy(false);
				setPage('signOTP');
			}, 400);
		}

		else if (page === 'signOTP' || page === 'loginOTP') {
			if (!params.get('table')) return toast.error('Please scan the QR Code');

			setBusy(true);

			const res = await signIn('customer', {
				redirect: false,
				restaurant: pathname.replaceAll('/', ''),
				phone: phoneNumber,
				fname,
				lname,
				table: params.get('table'),
				callbackUrl: `${window.location.origin}`,
			});

			if (res?.error) {
				toast.error(res?.error);
			}
			setOpen(false);
			setBusy(false);
		}
	};

	useEffect(() => {
		if (page === 'phone') {
			setHeading(['Let\'s', ' start ordering']);
			setButtonLabel('Next');
		} else if (page === 'signOTP') {
			setHeading(['Glad to', ' see you here']);
			setButtonLabel('Order');
		} else if (page === 'loginOTP') {
			setHeading(['Welcome', ' back User']);
			setButtonLabel('Log In');
		}
	}, [page]);

	return (
		<div className={`userLogin ${page}`}>
			<div className='header'>
				<span className='heading'><span>{heading[0]}</span>{heading[1]}</span>
			</div>
			<div className='content'>
				<Textfield
					className='phone'
					type='phone'
					autoComplete='tel-local'
					value={phone}
					onEnterKey={onNext}
					onChange={(e) => setPhone(e.target.value)}
				/>
				<div className='otpContainer'>
					<Textfield
						className='fName'
						placeholder='First Name'
						autoComplete='given-name'
						value={fname}
						onChange={(e) => setFName(e.target.value)}
					/>
					<Textfield
						className='lName'
						placeholder='Last Name'
						autoComplete='family-name'
						onEnterKey={onNext}
						value={lname}
						onChange={(e) => setLName(e.target.value)}
					/>
					{/* <Textfield
						className='otp'
						placeholder='Enter Your otp'
						autoComplete='one-time-code'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
					/> */}
				</div>
			</div>
			<div className='footer'>
				<Button label={buttonLabel} onClick={onNext} loading={busy} />
			</div>
		</div>
	);
};

export default UserLogin;

type UserLoginProps = {
	setOpen: (open: boolean) => void
}
