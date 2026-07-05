export interface ExportOptions {
  format: "csv" | "pdf" | "xlsx";
  filename: string;
  includeHeaders: boolean;
  selectedColumns?: string[];
}

export interface ExportData {
  headers: string[];
  rows: Record<string, unknown>[];
  title?: string;
  generatedAt?: Date;
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: ExportData, options: ExportOptions): void {
  const { headers, rows } = data;
  const { filename, includeHeaders, selectedColumns } = options;

  // Filter columns if specified
  const columnsToExport = selectedColumns || headers;
  const filteredHeaders = headers.filter((h) => columnsToExport.includes(h));

  // Build CSV content
  let csvContent = "";

  if (includeHeaders) {
    csvContent += filteredHeaders.map((h) => `"${h}"`).join(",") + "\n";
  }

  rows.forEach((row) => {
    const values = filteredHeaders.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return '""';
      if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
      return `"${String(value)}"`;
    });
    csvContent += values.join(",") + "\n";
  });

  // Download file
  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: ExportData, options: ExportOptions): void {
  const { filename } = options;
  const jsonContent = JSON.stringify(
    {
      title: data.title || "Export",
      generatedAt: data.generatedAt || new Date(),
      data: data.rows,
    },
    null,
    2
  );

  downloadFile(jsonContent, `${filename}.json`, "application/json");
}

/**
 * Export data to PDF format (requires external library)
 * This is a placeholder - actual PDF generation would use jsPDF or similar
 */
export function exportToPDF(data: ExportData, options: ExportOptions): void {
  const { filename } = options;

  // Create HTML table
  let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #0F6E56; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #0F6E56; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          tr:hover { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>${data.title || "Export"}</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              ${data.headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.rows
              .map(
                (row) => `
              <tr>
                ${data.headers.map((h) => `<td>${row[h] || ""}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  downloadFile(htmlContent, `${filename}.html`, "text/html");
}

/**
 * Helper function to download file
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prepare data for export
 */
export function prepareExportData(
  items: Record<string, unknown>[],
  title: string
): ExportData {
  if (items.length === 0) {
    return {
      headers: [],
      rows: [],
      title,
      generatedAt: new Date(),
    };
  }

  const headers = Object.keys(items[0]);
  return {
    headers,
    rows: items,
    title,
    generatedAt: new Date(),
  };
}
