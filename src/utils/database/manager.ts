import bcrypt from 'bcrypt';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import connectDB from './connect';

const SALT_ROUNDS = 16;

export const checkIfExist = async <T>(model: Model<T>, query: FilterQuery<T>) => {
	await connectDB();
	return !!(await model.findOne(query));
};

export const createIfNotExist = async <T>(model: Model<T>, query: FilterQuery<T>, update: UpdateQuery<T>) => {
	await connectDB();
	return model.findOneAndUpdate(query, update, { upsert: true, new: true, setDefaultsOnInsert: true });
};

export const isBcryptHash = (text: string) => {
	const bcryptPrefixRegex = /^\$2[aby]\$[0-9]{2}\$/;
	return bcryptPrefixRegex.test(text);
};

export const hashPassword = (password: string) => {
	return bcrypt.hashSync(password, SALT_ROUNDS);
};

export const verifyPassword = (password?: string, hash?: string) => {
	if (!password || !hash) return false;
	return bcrypt.compareSync(password, hash);
};
