import prisma from ".";

async function seedDb() {
	try {
		await seedMarkets();
		await seedSellers();
		await seedProducts();
		await seedAgents();
		await seedUsers();
		await seedShippers(); // Add this line to call the new function
		console.log("🌱 Database seeding completed successfully");
	} catch (error) {
		console.log("🌱 Database seeding failed");
		console.log(error);
	}
}

async function seedMarkets() {
	await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await prisma.market.createMany({
		skipDuplicates: true,
		data: [
			{
				name: "Anono",
				latitude: 5.3424059,
				longitude: -3.9751328,
				pictureUrl:
					"https://media-files.abidjan.net/photo/Consommateurs_Willy14.jpg",
			},
			{
				name: "Palmeraie",
				latitude: 5.3640433,
				longitude: -3.9699977,
				pictureUrl:
					"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/e2/fc/8c/marche-de-treichville.jpg?w=1200&h=-1&s=1",
			},
			{
				name: "Cocovico",
				latitude: 5.3829015,
				longitude: -3.9943317,
				pictureUrl:
					"https://lh5.googleusercontent.com/p/AF1QipNfxi6yNTQMWk8mk2reJtIOR5tlAmW53mMMgoMv=w408-h306-k-no",
			},
		],
	});
	console.log("✅ Markets seeded successfully");
}

async function seedSellers() {
	const market = await prisma.market.findFirst({
		where: {
			name: "Anono",
		},
	});

	if (!market) {
		throw new Error("❌ No market found");
	}

	await prisma.seller.createMany({
		skipDuplicates: true,
		data: [
			{
				firstName: "Jonathan",
				lastName: "KOUAKOU",
				gender: "M",
				tableNumber: 1,
				marketId: market.marketId,
			},
			{
				firstName: "Aminata",
				lastName: "DIALLO",
				gender: "F",
				tableNumber: 2,
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Sellers seeded successfully");
}

async function seedProducts() {
	const seller = await prisma.seller.findFirst({
		where: {
			firstName: "Jonathan",
		},
	});

	if (!seller) {
		throw new Error("❌ No seller found");
	}

	await prisma.product.createMany({
		skipDuplicates: true,
		data: [
			{
				name: "Tomates",
				amount: 1,
				unit: "pc",
				price: 500,
				description: "Notre sélection de tomates fraîches",
				pictureUrl: [
					"https://www.vincenzosonline.com/userContent/images/Blog/Tomatoes/tomatoes-5.jpg",
				],
				sellerId: seller.sellerId,
			},
			{
				name: "Pommes",
				amount: 1,
				unit: "kg",
				price: 1000,
				description: "Notre sélection de pommes fraîches",
				pictureUrl: [
					"https://hips.hearstapps.com/hmg-prod/images/apples-royalty-free-image-164084111-1537885595.jpg?crop=0.66667xw:1xh;center,top&resize=1200:*",
				],
				sellerId: seller.sellerId,
			},
		],
	});
	console.log("✅ Products seeded successfully");
}

async function seedAgents() {
	const market = await prisma.market.findFirst({
		where: { name: "Anono" },
	});

	if (!market) {
		throw new Error("❌ Anono market not found");
	}

	await prisma.agent.createMany({
		skipDuplicates: true,
		data: [
			{
				email: "agent@anono.com",
				password: Bun.password.hashSync("testagent"),
				firstName: "Franck",
				lastName: "DIAKITE",
				phone: "0505201515",
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Agents seeded successfully");
}

async function seedUsers() {
	await prisma.user.createMany({
		skipDuplicates: true,
		data: [
			{
				email: "user@omarche.com",
				password: Bun.password.hashSync("testuser"), // Ensure you hash the password appropriately
				firstName: "User",
				lastName: "Anono",
				city: "Abidjan",
				address: "123 Market Street",
				phone: "0123456789",
			},
		],
	});
	console.log("✅ Users seeded successfully");
}

async function seedShippers() {
	const market = await prisma.market.findFirst({
		where: { name: "Anono" },
	});

	if (!market) {
		throw new Error("❌ Anono market not found");
	}

	await prisma.shipper.createMany({
		skipDuplicates: true,
		data: [
			{
				firstName: "Hassan",
				lastName: "COULIBALY",
				email: "shipper@anono.com",
				password: Bun.password.hashSync("testshipper"),
				phone: "0501010101",
				marketId: market.marketId,
			},
		],
	});
	console.log("✅ Shippers seeded successfully");
}

console.log("🌱 Starting database seeding");
await seedDb()
	.then(() => {})
	.catch((error) => {
		console.log(error);
		console.log("🌱 Database seeding failed");
	});
