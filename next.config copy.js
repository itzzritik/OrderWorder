/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: "@svgr/webpack",
					options: {
						typescript: true,
						ext: "tsx",
					},
				},
			],
		});

		return config;
	},
};

module.exports = nextConfig;
