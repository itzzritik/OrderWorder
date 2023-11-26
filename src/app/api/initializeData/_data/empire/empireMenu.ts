import { TMenu } from '#utils/database/models/menu';

const empireBox = [
	{
		name: 'Ghee Rice With Boneless Butter Chicken & Manchurian Dry',
		description: 'Ghee Rice, Butter Chicken Boneless (5 Pcs), Manchurian Dry (5 Pcs)',
		category: 'Empire Box',
		price: 199,
		foodType: 'spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/3c1/7394ef6f5086c3b3c4b17130995d33c1.jpg',
	},
	{
		name: 'Ghee Rice With Dal Fry',
		description: 'Ghee Rice, Dal Fry',
		category: 'Empire Box',
		price: 110,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/5fc/dff6a95626a60b75c7de72055f0b15fc.png',
	},
	{
		name: 'Biriyani Rice With Chilly Chicken Boneless',
		description: 'Biriyani Rice, Raitha, Chilly Chicken Bonless (5 Pcs)',
		category: 'Empire Box',
		price: 150,
		foodType: 'extra-spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/e70/85ec2da1cdb0c37a01bf4f345979de70.jpg',
	},
	{
		name: 'Veg Fried Rice And Gobi Manchurian',
		description: 'Veg Fried Rice, Gobi Manchurian',
		category: 'Empire Box',
		price: 140,
		foodType: 'spicy',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/b95/bffa32a74a9c20e1a5831edc57cd5b95.png',
	},
];

const rice = [
	{
		name: 'Mutton Biriyani Boneless',
		description: null,
		category: 'Biryani And Rice',
		price: 185,
		foodType: 'spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/280/2112a1536b75e649b09d84fce0eef280.jpg',
	},
	{
		name: 'Egg Biriyani',
		description: null,
		category: 'Biryani And Rice',
		price: 120,
		foodType: 'spicy',
		veg: 'contains-egg',
		image: 'https://b.zmtcdn.com/data/dish_photos/071/95e4aa6e1a4688feda7257c75a198071.jpg',
	},
	{
		name: 'Veg Biriyani',
		description: null,
		category: 'Biryani And Rice',
		price: 110,
		foodType: 'spicy',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/463/d31313b7b0e3317438bad307efc21463.jpg',
	},
	{
		name: 'Curd Rice',
		description: null,
		category: 'Biryani And Rice',
		price: 110,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/bba/a8592bf0db3405112f7393fc56623bba.jpg',
	},
];

const mainCourse = [
	{
		name: 'Kadai Chicken Dry',
		description: null,
		category: 'Main Course',
		price: 140,
		foodType: 'spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/a90/e90722778c19c42a5195cb35ca86fa90.jpg',
	},
	{
		name: 'Kadai Mutton Boneless Gravy',

		description: null,
		category: 'Main Course',
		price: 180,
		foodType: 'extra-spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/a90/e90722778c19c42a5195cb35ca86fa90.jpg',
	},
	{
		name: 'Kadai Veg',
		description: null,
		category: 'Main Course',
		price: 130,
		foodType: 'spicy',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/955/b12cb13c87a4752ba8d2e8ec1f4b8955.jpg',
	},
	{
		name: 'Paneer Tikka Masala',
		description: null,
		category: 'Main Course',
		price: 110,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/9cb/978cc7cb973723c3bda2e3d2707a49cb.jpg',
	},
];

const eggDishes = [
	{
		name: 'Boiled Egg (2 Nos)',
		description: null,
		category: 'Egg Dishes',
		price: 50,
		foodType: null,
		veg: 'contains-egg',
		image: 'https://b.zmtcdn.com/data/dish_photos/c9a/cfc0c8d10f678de0ab7f36bb79c6fc9a.jpg',
	},
	{
		name: 'Egg Bulls Eye',
		description: null,
		category: 'Egg Dishes',
		price: 50,
		foodType: 'spicy',
		veg: 'contains-egg',
		image: 'https://b.zmtcdn.com/data/dish_photos/22f/15f4dd017b5ca2f46bd0f55fa55dd22f.jpg',
	},
	{
		name: 'Egg Masala',

		description: null,
		category: 'Egg Dishes',
		price: 105,
		foodType: 'spicy',
		veg: 'contains-egg',
		image: 'https://b.zmtcdn.com/data/dish_photos/a50/75461abff94269645ef85d57cf908a50.jpg',
	},
];

const friedRice = [
	{
		name: 'Mix Fried Rice Non Veg',
		description: null,
		category: 'Fried Rice and Noodles',
		price: 150,
		foodType: 'spicy',
		veg: 'non-veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/a57/2665a52529b343d63966684f30ffba57.jpg',
	},
	{
		name: 'Veg Fried Rice',
		description: null,
		category: 'Fried Rice and Noodles',
		price: 110,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/901/1767d538164bf58f15c00d37e7197901.jpg',
	},
	{
		name: 'Hakka Noodles',
		description: null,
		category: 'Fried Rice and Noodles',
		price: 120,
		foodType: 'spicy',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/901/1767d538164bf58f15c00d37e7197901.jpg',
	},
];

const breads = [
	{
		name: 'Butter Roti',
		description: null,
		category: 'Breads',
		price: 50,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/a62/b1e746cea233a01a56368bf963bcba62.jpg',
	},
	{
		name: 'Butter Naan',
		description: null,
		category: 'Breads',
		price: 30,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/437/37521ee5db5bbb5f3398870cd36f0437.jpg',
	},
	{
		name: 'Kulcha',
		description: null,
		category: 'Breads',
		price: 40,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/1f6/0caeff7f0fd2f11b07156776398b81f6.jpg',
	},
	{
		name: 'Tandoori Roti',
		description: null,
		category: 'Breads',
		price: 30,
		foodType: null,
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/897/5438b36bd0eb9498dd095bb628ae9897.jpg',
	},
];

const beverages = [
	{
		name: 'Chocolate Shake',
		description: null,
		category: 'Beverages',
		price: 80,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/cf1/e7ef9c4788459485c1e2fe5ac3398cf1.jpg',
	},
	{
		name: 'Blue Angel',
		description: null,
		category: 'Beverages',
		price: 90,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/841/d8339ee1bb8ff6957fc53fd9b00e9841.jpg',
	},
	{
		name: 'Lassi sweet',
		description: null,
		category: 'Beverages',
		price: 50,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://b.zmtcdn.com/data/dish_photos/0d3/4a4eec00227db36ad4bc380ec97dd0d3.jpg',
	},
];

const desserts = [
	{
		name: 'Rabdi Falooda',
		description: null,
		category: 'Desserts',
		price: 100,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNagtidO6K8puIclUH4pDKKQmnLMTu1uQOgeV-gOGyfilMahQ&s',
	},
	{
		name: 'Strawberry Ice Cream',
		description: null,
		category: 'Desserts',
		price: 30,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://images.media-allrecipes.com/userphotos/838110.jpg',
	},
	{
		name: 'Death By Chocolate',
		description: null,
		category: 'Desserts',
		price: 150,
		foodType: 'sweet',
		veg: 'veg',
		image: 'https://irepo.primecp.com/2015/04/218935/Death-By-Chocolate_MASTER_ID-977271.jpg?v=977271',
	},
];

let menus = [
	...mainCourse,
	...rice,
	...eggDishes,
	...friedRice,
	...empireBox,
	...breads,
	...beverages,
	...desserts,
] as TMenu[];

menus = menus.map((menu) => {
	menu.restaurantID = 'empire';
	if (!menu?.taxPercent) menu.taxPercent = 5;
	if (!menu?.hidden) menu.hidden = false;
	return menu;
});

export { menus };
