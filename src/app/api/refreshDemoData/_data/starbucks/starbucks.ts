/* eslint-disable max-len */
import { menus } from './starbucksMenu';

const account = {
	email: 'admin@starbucks.com',
	username: 'starbucks',
	password: 'starbucks@123',
	verified: true,
};

const profile = {
	name: 'Starbucks Coffee',
	restaurantID: 'starbucks',
	description: 'coffee chain offering an extensive range of freshly brewed coffees, teas, and assorted beverages along with a selection of delectable snacks and pastries across numerous locations worldwide.',
	address: 'Indiranagar, Benagaluru',
	themeColor: { h: 158, s: 100, l: 19 },
	avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
	cover: 'https://b.zmtcdn.com/data/reviews_photos/c9f/cad697975e8e2871657b7df8ceea2c9f_1410727142.jpg',
	photos: [
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/ce781e895d9c5e37f78260c3448706f7.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/f267aabee95edaab070906794fc8376d.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/49afabd6f32e87aafa8f7659ef3fd070.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/bff9ffbd48bca364e9dafbd0a9e0e9c3.jpg',
		'https://b.zmtcdn.com/data/pictures/5/57475/49e2967d4c20b644cbb0f02b11afcbea.jpg',
		'https://b.zmtcdn.com/data/pictures/5/57475/36acb17fabb544199bfd19af7c7e1dfb.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/3a92d58466f9aa68b8fba5c2a0868a8b.png',
		'https://b.zmtcdn.com/data/pictures/5/57475/61a4ca48fd90f2ba39c4ce96a162afcb.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/ef03495611c31534bfc0f5acf628a237.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/124b0171bcf6cab6cbad7a4ff6dde399.png',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/a05a4b5accc7786bfd17530357015c53.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/7cdc6585649e042002df1d250a3948b0.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/b6ccfeb22c435de80ece4a8b7bde4593.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/694b4fcb1d82545287b2ef6d15d56097.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/d5e936a50fb81ab5a84007f9943dc519.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/8040c8f309c65fe1112f9f825f0d7273.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/6b5e57ac4494f50511f57a638c1b3c62.png',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/53f4c14d98f797f1e7a20af7faef6134.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/e1363813e2b43d8c5856746e7eb6144c.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/6b03598a0a60964a3e33142323e6a9c1.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/5de7092665ca155499fec2def3add774.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/caf67a8148c0a93ee4a310e58bff129b.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/49de5680fd1e4fc9c4baf52f06d2bc14.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/3/56603/b63d9045509132a17bb3d634f7e85bbe.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/c9f/cad697975e8e2871657b7df8ceea2c9f_1410727142.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/5c0/bd4b61408ab91bff9a0d4d3aef9545c0_1502056808.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/f00/5d3fc2d3705f02e0b8a61e1e92487f00_1501822276.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/9ad/0cba4797527f1f75e29bfbd014a6d9ad_1415515815.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/c48/c496d45efd13f313448598bef1d7fc48_1522323191.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/f3a/d24fbff2461e21e1607ad5b33c5b2f3a_1574522191.jpg',
	],
	categories: [
		'Holiday Special',
		'Frappuccino',
		'Cold Beverages',
		'Hot Beverages',
		'Savouries',
		'Sandwiches',
		'Wraps',
		'Desserts',
	],
};

const kitchens = [
	{
		restaurantID: 'starbucks',
		username: 'starbucksKitchen1',
		password: '123456',
	},
];

const tables = Array.from({ length: 5 }, (_, i) => ({
	restaurantID: 'starbucks',
	name: 'Table ' + i,
	username: i.toString(),
}));

const starbucks = {
	account, profile, menus, kitchens, tables,
};

export default starbucks;
