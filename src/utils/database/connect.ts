import { connect } from 'mongoose';
import './models/profile';
import './models/account';
import './models/customer';
import './models/kitchen';
import './models/menu';
import './models/table';
import './models/order';

if (!process.env.MONGODB_URI) {
	throw new Error('Please add your MongoDB URI to Environment Variables.');
}

const options = {
	autoIndex: false,
};
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB () {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		console.log('🌿 Connecting to Mongo Server');
		cached.promise = connect(process.env.MONGODB_URI!, options)
			.then((mongoose) => {
				console.log('🍃 Mongo Connection Established');
				return mongoose;
			})
			.catch((error) => {
				console.error('🍂 MongoDB Connection Failed: ', error);
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectDB;
