require("dotenv").config();
const { faker } = require("@faker-js/faker");
const prisma = require("../db");

const CATEGORIES = ["Electronics", "Books", "Home & Kitchen", "Toys", "Clothing", "Sports"];
const PRODUCT_COUNT = 100;

async function main() {
  console.log(`Seeding ${PRODUCT_COUNT} products...`);

const products = Array.from({ length: PRODUCT_COUNT }, () => {
  const price = Number(faker.commerce.price({ min: 5, max: 500, dec: 2 }));
  const discountPercent = faker.number.int({ min: 10, max: 70 });
  const mrp = (price / (1 - discountPercent / 100)).toFixed(2);

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: price.toFixed(2),
    mrp,
    imageUrl: faker.image.urlPicsumPhotos(),
    category: faker.helpers.arrayElement(CATEGORIES),
    stock: faker.number.int({ min: 0, max: 200 }),
    rating: faker.number.float({ min: 2.5, max: 5, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 15000 }),
  };
});

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
