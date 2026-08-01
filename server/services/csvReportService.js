const { Parser } = require('json2csv');

// CSV is inherently flat, so we export expenses and income as two concatenated
// sections rather than trying to force them into one table.
function generateCsvReport(reportData, type, res) {
  const { expenses, incomes, totals } = reportData;

  const expenseRows = expenses.map((e) => ({
    section: 'EXPENSE',
    date: new Date(e.date).toLocaleDateString('en-US'),
    title: e.title,
    category: e.category.name,
    amount: Number(e.amount),
    paymentMethod: e.paymentMethod,
    merchant: e.merchantName || '',
  }));

  const incomeRows = incomes.map((i) => ({
    section: 'INCOME',
    date: new Date(i.date).toLocaleDateString('en-US'),
    title: i.source,
    category: '',
    amount: Number(i.amount),
    paymentMethod: '',
    merchant: '',
  }));

  const fields = ['section', 'date', 'title', 'category', 'amount', 'paymentMethod', 'merchant'];
  const parser = new Parser({ fields });
  const csv = parser.parse([...expenseRows, ...incomeRows]);

  const summaryHeader =
    `# ${type} Report\n` +
    `# Total Income,${totals.totalIncome}\n` +
    `# Total Expenses,${totals.totalExpenses}\n` +
    `# Net Balance,${totals.netBalance}\n\n`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type.toLowerCase()}-report.csv"`);
  res.send(summaryHeader + csv);
}

module.exports = { generateCsvReport };
