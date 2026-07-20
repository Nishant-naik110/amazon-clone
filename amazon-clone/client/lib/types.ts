// lib/types.ts
export type Product = {
  id: string;
  name: string;
  price: string; // Decimal comes through as a string from Prisma/JSON
  imageUrl: string;
  category: string;
  stock: number;
  trending?: boolean; // not in the DB yet — optional so it degrades safely
};