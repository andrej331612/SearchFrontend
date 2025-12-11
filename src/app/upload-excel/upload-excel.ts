import { Component } from '@angular/core';
import { UploadExcelService } from '../service/upload-excel';
import { HttpClient } from '@angular/common/http';
import { JsonPipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-upload-excel',
  imports: [CommonModule, JsonPipe, RouterLink],
  templateUrl: './upload-excel.html',
  styleUrl: './upload-excel.css',
})
export class UploadExcel {

 excelData: any[] = [];

  constructor(
    private excelUpload: UploadExcelService,
    private http: HttpClient
  ) {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.excelData = await this.excelUpload.parseExcel(file);
    console.log("Parsed Excel Data:", this.excelData);
  }

  // TO:DO Implemet this 
  processExcel() {
    if (!this.excelData.length) return;

    this.excelData.forEach(row => {
      const params = {
        serialNumber: row['serialNumber'],
        lineId: row['lineId'],
        status: row['status']
      };

      this.http.get('/api/rdk/migrations', { params }).subscribe({
        next: res => console.log('API OK:', res),
        error: err => console.error('API ERROR:', err)
      });
    });
  }
}