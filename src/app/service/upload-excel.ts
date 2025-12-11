import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class UploadExcelService {
  
  async parseExcel(file: File): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();

    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0]; // first sheet
    const rows: any[] = [];

    let headers: string[] = [];

    worksheet.eachRow((row, rowIndex) => {
      const rowValues = row.values as any[];

      if (rowIndex === 1) {
        // First row = headers
        headers = rowValues.slice(1);
      } else {
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = rowValues[i + 1];
        });
        rows.push(obj);
      }
    });

    return rows;
  }
}