import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class Excel {

  async exportAsExcelFile(data: any[], fileName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Add data rows
    data.forEach(row => {
      worksheet.addRow(headers.map(header => row[header]));
    });

    // DYNAMIC AUTO-FIT COLUMNS - TypeScript safe
    worksheet.columns.forEach((column) => {
      let maxLength = 10;

      // Check header length
      if (column.header && typeof column.header === 'string') {
        maxLength = Math.max(maxLength, column.header.length);
      }

      // Check data cells safely
      if (column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (cell.value !== null && cell.value !== undefined) {
            const cellLength = cell.value.toString().length;
            maxLength = Math.max(maxLength, cellLength);
          }
        });
      }

      // Set width with max limit
      column.width = Math.min(maxLength + 2, 50);
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}