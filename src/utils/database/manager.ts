import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import connectDB from './connect';

export const findOne = async <T>(model: Model<T>, query: FilterQuery<T>) => {
	await connectDB();
	return model.findOne(query);
};

export const checkIfExist = async <T>(model: Model<T>, query: FilterQuery<T>) => {
	return !!(await findOne(model, query));
};

export const createIfNotExist = async <T>(model: Model<T>, query: FilterQuery<T>, update: UpdateQuery<T>) => {
	await connectDB();
	return model.findOneAndUpdate(query, update, { upsert: true, new: true, setDefaultsOnInsert: true });
};
