const PDFDocument = require('pdfkit');

function formatMoney(n) {
  return `NGN ${Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Streams a PDF report to the given writable stream (e.g. an Express response).
function generatePdfReport(reportData, type, res) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);

  const { user, range, totals, categoryBreakdown, expenses, incomes } = reportData;

  // Header
  doc.fontSize(20).fillColor('#0984E3').text('Expense Manager', { continued: false });
  doc.fontSize(14).fillColor('#2D3436').text(`${type} Report`);
  doc.fontSize(10).fillColor('#636E72')
    .text(`${user?.name || ''}  ·  ${formatDate(range.start)} – ${formatDate(range.end)}`);
  doc.moveDown(1.2);

  // Summary box
  doc.fontSize(12).fillColor('#2D3436');
  doc.text(`Total Income:    ${formatMoney(totals.totalIncome)}`);
  doc.text(`Total Expenses:  ${formatMoney(totals.totalExpenses)}`);
  doc.text(`Net Balance:     ${formatMoney(totals.netBalance)}`);
  doc.text(`Transactions:    ${totals.transactionCount}`);
  doc.moveDown(1);

  // Category breakdown
  if (categoryBreakdown.length) {
    doc.fontSize(13).fillColor('#0984E3').text('Spending by Category');
    doc.moveDown(0.3);
    categoryBreakdown.forEach((c) => {
      doc.fontSize(10).fillColor('#2D3436').text(`${c.category}`, { continued: true, width: 300 });
      doc.text(formatMoney(c.amount), { align: 'right' });
    });
    doc.moveDown(1);
  }

  // Expense list
  if (expenses.length) {
    doc.fontSize(13).fillColor('#0984E3').text('Expenses');
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor('#636E72');
    expenses.forEach((e) => {
      if (doc.y > 720) doc.addPage();
      doc.fillColor('#2D3436').fontSize(9).text(
        `${formatDate(e.date)}   ${e.title}   [${e.category.name}]`,
        { continued: true, width: 380 }
      );
      doc.fillColor('#E17055').text(formatMoney(e.amount), { align: 'right' });
    });
    doc.moveDown(1);
  }

  // Income list
  if (incomes.length) {
    if (doc.y > 650) doc.addPage();
    doc.fontSize(13).fillColor('#0984E3').text('Income');
    doc.moveDown(0.3);
    incomes.forEach((i) => {
      if (doc.y > 720) doc.addPage();
      doc.fillColor('#2D3436').fontSize(9).text(`${formatDate(i.date)}   ${i.source}`, { continued: true, width: 380 });
      doc.fillColor('#00B894').text(formatMoney(i.amount), { align: 'right' });
    });
  }

  doc.end();
}

module.exports = { generatePdfReport };
