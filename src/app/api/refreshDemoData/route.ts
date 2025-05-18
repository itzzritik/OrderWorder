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

	return results;
};

const createData = async (props: TDocumentData) => {
	const { account, profile, menus, kitchens, tables } = props;

	const startTime = performance.now();
	const newAccount = await new Accounts(account).save();

	return {
		account: newAccount,
		profile: await new Profiles(profile).save(),
		menus: await Promise.all(menus.map(async (menu) => await new Menus(menu).save())),
		kitchens: await Promise.all(kitchens.map(async (kitchen) => await new Kitchens(kitchen).save())),
		tables: await Promise.all(tables.map(async (table) => await new Tables(table).save())),
		processTime: (performance.now() - startTime) / 1000,
	};
};

export async function GET () {
	await connectDB();
	try {
		const response = {
			totalProcessTime: performance.now(),
			deleteData: await deleteData(['empire', 'starbucks']),
			empire: await createData(empire),
			starbucks: await createData(starbucks),
		};

		response.totalProcessTime = (performance.now() - response.totalProcessTime) / 1000;

		return new Response(JSON.stringify(response, null, 4));
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
