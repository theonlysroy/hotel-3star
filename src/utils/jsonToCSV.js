import ExcelJs from "exceljs";

export default async function createCSVFromJSONData(sheetName, data, filename) {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet(String(sheetName || "Sheet 1"));

  const headers = Object.keys(data[0]);
  const wsColumns = headers?.map((f) => ({
    header: String(f).toUpperCase(),
    key: f,
  }));
  worksheet.columns = wsColumns;

  data.map((row) => worksheet.addRow(row));
  const filePath = `csv/${filename}.csv`;
  workbook.csv.writeFile(filePath);
}
