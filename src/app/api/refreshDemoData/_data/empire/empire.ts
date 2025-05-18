/* eslint-disable max-len */
import { menus } from './empireMenu';

const account = {
	email: 'admin@empire.com',
	username: 'empire',
	password: 'empire@123',
	verified: true,
};

const profile = {
	name: 'Empire Restaurant',
	restaurantID: 'empire',
	description: 'Casual Dining - Kerala, Biryani, North Indian, South Indian, Chinese, Arabian, Seafood',
	address: 'koramangala, Benagaluru',
	themeColor: { r: 86, g: 12, b: 28 },
	avatar: 'https://lh3.googleusercontent.com/6pc0PrmxaBRy3IQNzdtCWW86iCecUOM7GXJnEKIIi56mtJ5nl1OCo_ZwjyaxtTsDstg3l1GUkH_95158smqRIrwtDSPvP_iX9Upd7E9c',
	cover: 'https://b.zmtcdn.com/data/pictures/chains/1/50471/bcf68da39dcfb0fe5bcfb742c337385e.jpg',
	photos: [
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/bcf68da39dcfb0fe5bcfb742c337385e.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/3238da54d036bc4a24c69309db215458.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/c9c94a1affb4a0be24a3fc91f285da6d.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/b2e6911d5a2ef831b0475f26e7a6d200.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/3f7d0fcb37310b70701adc93fba7bb96.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/2e6e0550037b489549da769346548ef2.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/b85147bdc621c72a9f63aca97f72b6a8.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/8239a9f15f8d1ab9f9551a5f5e9af3bf.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/8f58317102571f37f7cfd36e4027222b.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/f81b38bff2388b18fd365ac216db944a.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/c2f8c27d1ed123550c9356f5281407f2.jpg',
		'https://b.zmtcdn.com/data/pictures/chains/1/50471/2514e75a086df60ccaee446068abacb8.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/5ef/130beef1e1768ea6045b57440e44e5ef_1527536813.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/d08/f5d1f64d36c2634e94bff8f7a5821d08_1537101665.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/a3c/316af8739cdf1645ef9c23b5938d8a3c_1527536830.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/5ae/780b2f7d1207d4c8592473d3621905ae_1579370824.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/06f/241406eb8aa32f135d97156a4949d06f_1527536860.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/356/4f22cb0508783c7f49b0532a567d4356_1584007381.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/9cb/77fbb10f23b8c46ecae5e071c4bdb9cb_1531609856.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/68d/9d514385656ad6f7bd285e1918b0668d_1533743694.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/3de/921a1c03287fe2f73809755b9e5a83de_1534485962.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/f3c/5221857e888ddc77117a35f7b5f60f3c_1684675449.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/c09/3848c0b9b06a9a2abf791f21ff133c09_1527536836.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/129/1d2a228387e47200d17f6866ec82e129_1534486005.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/db3/e5b65861e466108f2d176bb5979fbdb3_1569592213.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/6c1/870d51d85b748f7e17d0b8d00df2e6c1_1529050124.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/43b/47a89838feee09818c36ecba9522843b_1532514159.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/b69/2bcf4b71fadfc526d71ccbdb38386b69_1527536797.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/8ba/4b8c67d20d9ecb0a4adfe828e01c48ba_1552139131.jpg',
		'https://b.zmtcdn.com/data/reviews_photos/c29/60512516d01b0eddebcc83b5c5fc8c29_1556211239.jpg',
	],
	categories: [
		'Main Course',
		'Biryani And Rice',
		'Egg Dishes',
		'Fried Rice and Noodles',
		'Empire Box',
		'Breads',
		'Beverages',
		'Desserts',
	],
};

const kitchens = [
	{
		restaurantID: 'empire',
		username: 'empireKitchen1',
		password: '123456',
	},
];

const tables = Array.from({ length: 5 }, (_, i) => ({
	restaurantID: 'empire',
	name: 'Table ' + i,
	username: i.toString(),
}));

const empire = {
	account, profile, menus, kitchens, tables,
};

export default empire;
