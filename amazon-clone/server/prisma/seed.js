require("dotenv").config();
const { faker } = require("@faker-js/faker");
const prisma = require("../db");

const CATEGORIES = ["Electronics", "Books", "Home & Kitchen", "Toys", "Clothing", "Sports"];
const PRODUCT_COUNT = 100;

async function main() {
  console.log(`Seeding ${PRODUCT_COUNT} products...`);

  const products = Array.from({ length: PRODUCT_COUNT }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 5, max: 500, dec: 2 }),
    imageUrl: faker.image.urlPicsumPhotos(),
    category: faker.helpers.arrayElement(CATEGORIES),
    stock: faker.number.int({ min: 0, max: 200 }),
  }));

  await prisma.product.createMany({ data: products });
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
