import bcrypt from 'bcrypt';

const SALT_ROUNDS = 16;
const bcryptPrefixRegex = /^\$2[aby]\$[0-9]{2}\$/;

export const hashPassword = (password: string) => {
	if (bcryptPrefixRegex.test(password)) throw 'Hashed password cannot be hashed again';
	if (password.length < 6) throw 'Password must be at least 6 characters long';

	return bcrypt.hashSync(password, SALT_ROUNDS);
};

export const verifyPassword = (password?: string, hash?: string) => {
	if (!password || !hash) return false;
	return bcrypt.compareSync(password, hash);
};
