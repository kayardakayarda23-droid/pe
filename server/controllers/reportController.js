const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');
const { gatherReportData } = require('../services/reportDataService');
const { generatePdfReport } = require('../services/pdfReportService');
const { generateExcelReport } = require('../services/excelReportService');
const { generateCsvReport } = require('../services/csvReportService');

const VALID_TYPES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'BUDGET', 'INCOME', 'EXPENSE', 'CATEGORY'];

async function dispatch(reportData, type, format, res) {
  const normalizedFormat = (format || 'pdf').toLowerCase();

  // Log report generation for history/audit (Report model)
  prisma.report
    .create({
      data: {
        userId: reportData.user.id,
        type,
        periodStart: reportData.range.start,
        periodEnd: reportData.range.end,
        format: normalizedFormat.toUpperCase(),
      },
    })
    .catch(() => {}); // non-blocking; don't fail the download if logging fails

  if (normalizedFormat === 'excel' || normalizedFormat === 'xlsx') {
    return generateExcelReport(reportData, type, res);
  }
  if (normalizedFormat === 'csv') {
    return generateCsvReport(reportData, type, res);
  }
  return generatePdfReport(reportData, type, res); // default: pdf
}

// GET /api/reports/:type?format=pdf|excel|csv&startDate=&endDate=
exports.generateReport = catchAsync(async (req, res) => {
  const type = req.params.type.toUpperCase();
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ success: false, message: `Invalid report type. Use one of: ${VALID_TYPES.join(', ')}` });
  }

  const { format, startDate, endDate } = req.query;
  const reportData = await gatherReportData(req.user.id, type, startDate, endDate);
  await dispatch(reportData, type, format, res);
});

// GET /api/reports/monthly  (convenience shortcut used by the original spec)
exports.monthlyReport = catchAsync(async (req, res) => {
  const reportData = await gatherReportData(req.user.id, 'MONTHLY');
  await dispatch(reportData, 'MONTHLY', req.query.format, res);
});

// GET /api/reports/yearly
exports.yearlyReport = catchAsync(async (req, res) => {
  const reportData = await gatherReportData(req.user.id, 'YEARLY');
  await dispatch(reportData, 'YEARLY', req.query.format, res);
});

// GET /api/reports/category  (JSON only — category breakdown for the given range, used to power a chart/table rather than a downloadable file)
exports.categoryReport = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const reportData = await gatherReportData(req.user.id, 'CATEGORY', startDate, endDate);
  res.json({
    success: true,
    data: {
      range: reportData.range,
      totals: reportData.totals,
      categoryBreakdown: reportData.categoryBreakdown,
    },
  });
});

// GET /api/reports/history  (past generated reports, from the Report table)
exports.getHistory = catchAsync(async (req, res) => {
  const reports = await prisma.report.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  res.json({ success: true, data: reports });
});
