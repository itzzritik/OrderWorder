import connectDB from '#utils/database/connect';
import { Accounts } from '#utils/database/models/account';
import { Kitchens } from '#utils/database/models/kitchen';
import { Menus } from '#utils/database/models/menu';
import { Profiles } from '#utils/database/models/profile';
import { Tables } from '#utils/database/models/table';
import { CatchNextResponse } from '#utils/helper/common';

import empire from './_data/empire/empire';
import starbucks from './_data/starbucks/starbucks';

const deleteData = async (ids: string[]) => {
	const start = performance.now();
	const models = [
		{ model: Menus, name: 'Menus' },
		{ model: Kitchens, name: 'Kitchens' },
		{ model: Profiles, name: 'Profiles' },
		{ model: Tables, name: 'Tables' },
		{ model: Accounts, name: 'Accounts', field: 'username' },
	];

	const results = await Promise.all(
		models.map(async ({ model, name, field = 'restaurantID' }) => {
			const res = await model.deleteMany({ [field]: { $in: ids } });
			return { model: name, ...res };
		}),
	);

	return {
		processTime: (performance.now() - start) / 1000,
		results,
	};
};

const createData = async (props: TDocumentData) => {
	const { account, profile, menus, kitchens, tables } = props;
	const start = performance.now();
	const newAccount = await new Accounts(account).save();
	const newProfile = await new Profiles(profile).save();
	const [newMenus, newKitchen, newTables] = await Promise.all([
		Promise.all(menus.map((m) => new Menus(m).save())),
		Promise.all(kitchens.map((k) => new Kitchens(k).save())),
		Promise.all(tables.map((t) => new Tables(t).save())),
	]);

	return {
		processTime: (performance.now() - start) / 1000,
		account: newAccount,
		profile: newProfile,
		menus: newMenus,
		kitchens: newKitchen,
		tables: newTables,
	};
};

export async function GET () {
	await connectDB();
	try {
		const start = performance.now();
		const deleteResult = await deleteData(['empire', 'starbucks']);
		const [empireResult, starbucksResult] = await Promise.all([
			createData(empire),
			createData(starbucks),
		]);

		const res = {
			totalProcessTime: (performance.now() - start) / 1000,
			delete: deleteResult,
			empire: empireResult,
			starbucks: starbucksResult,
		};
		return new Response(JSON.stringify(res, null, 4));

	}
	catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

type TDocumentData = {
	account: unknown,
	profile: unknown,
	menus: Array<unknown>,
	kitchens: Array<unknown>,
	tables: Array<unknown>
}
