const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultExpenseCategories = [
  { name: 'Food & Dining', icon: 'food', color: '#FF6B6B' },
  { name: 'Transportation', icon: 'car', color: '#4ECDC4' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#FFD93D' },
  { name: 'Rent', icon: 'home', color: '#6C5CE7' },
  { name: 'Utilities', icon: 'bolt', color: '#00B894' },
  { name: 'Healthcare', icon: 'heart', color: '#E17055' },
  { name: 'Education', icon: 'book', color: '#0984E3' },
  { name: 'Entertainment', icon: 'film', color: '#A29BFE' },
  { name: 'Travel', icon: 'plane', color: '#00CEC9' },
  { name: 'Insurance', icon: 'shield', color: '#636E72' },
  { name: 'Subscriptions', icon: 'repeat', color: '#FD79A8' },
  { name: 'Gifts', icon: 'gift', color: '#FAB1A0' },
  { name: 'Miscellaneous', icon: 'more-horizontal', color: '#B2BEC3' },
];

const defaultIncomeCategories = [
  { name: 'Salary', icon: 'briefcase', color: '#00B894' },
  { name: 'Investment', icon: 'trending-up', color: '#0984E3' },
  { name: 'Savings', icon: 'piggy-bank', color: '#6C5CE7' },
];

async function main() {
  for (const cat of defaultExpenseCategories) {
    await prisma.category.upsert({
      where: { userId_name: { userId: null, name: cat.name } },
      update: {},
      create: { ...cat, type: 'EXPENSE', isDefault: true },
    }).catch(async () => {
      // userId: null can't be used in a compound unique on some DBs; fall back to findFirst/create
      const exists = await prisma.category.findFirst({ where: { name: cat.name, isDefault: true } });
      if (!exists) await prisma.category.create({ data: { ...cat, type: 'EXPENSE', isDefault: true } });
    });
  }

  for (const cat of defaultIncomeCategories) {
    const exists = await prisma.category.findFirst({ where: { name: cat.name, isDefault: true } });
    if (!exists) await prisma.category.create({ data: { ...cat, type: 'INCOME', isDefault: true } });
  }

  console.log('Seed complete: default categories created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
