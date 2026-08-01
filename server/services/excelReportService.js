const ExcelJS = require('exceljs');

async function generateExcelReport(reportData, type, res) {
  const { totals, categoryBreakdown, expenses, incomes } = reportData;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Expense Manager';
  workbook.created = new Date();

  // Summary sheet
  const summary = workbook.addWorksheet('Summary');
  summary.columns = [{ width: 28 }, { width: 20 }];
  summary.addRow([`${type} Report`]).font = { bold: true, size: 14 };
  summary.addRow([]);
  summary.addRow(['Total Income', totals.totalIncome]).getCell(2).numFmt = '"₦"#,##0.00';
  summary.addRow(['Total Expenses', totals.totalExpenses]).getCell(2).numFmt = '"₦"#,##0.00';
  summary.addRow(['Net Balance', totals.netBalance]).getCell(2).numFmt = '"₦"#,##0.00';
  summary.addRow(['Transactions', totals.transactionCount]);
  summary.addRow([]);
  summary.addRow(['Category', 'Amount']).font = { bold: true };
  categoryBreakdown.forEach((c) => {
    summary.addRow([c.category, c.amount]).getCell(2).numFmt = '"₦"#,##0.00';
  });

  // Expenses sheet
  const expenseSheet = workbook.addWorksheet('Expenses');
  expenseSheet.columns = [
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Title', key: 'title', width: 28 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Amount', key: 'amount', width: 14 },
    { header: 'Payment Method', key: 'paymentMethod', width: 16 },
    { header: 'Merchant', key: 'merchant', width: 20 },
  ];
  expenseSheet.getRow(1).font = { bold: true };
  expenses.forEach((e) => {
    const row = expenseSheet.addRow({
      date: new Date(e.date).toLocaleDateString('en-NG'),
      title: e.title,
      category: e.category.name,
      amount: Number(e.amount),
      paymentMethod: e.paymentMethod,
      merchant: e.merchantName || '',
    });
    row.getCell('amount').numFmt = '"₦"#,##0.00';
  });

  // Income sheet
  const incomeSheet = workbook.addWorksheet('Income');
  incomeSheet.columns = [
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Source', key: 'source', width: 24 },
    { header: 'Amount', key: 'amount', width: 14 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];
  incomeSheet.getRow(1).font = { bold: true };
  incomes.forEach((i) => {
    const row = incomeSheet.addRow({
      date: new Date(i.date).toLocaleDateString('en-NG'),
      source: i.source,
      amount: Number(i.amount),
      notes: i.notes || '',
    });
    row.getCell('amount').numFmt = '"₦"#,##0.00';
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${type.toLowerCase()}-report.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { generateExcelReport };
