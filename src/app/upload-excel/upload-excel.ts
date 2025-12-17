import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { UploadExcelService } from '../service/upload-excel';

@Component({
  selector: 'app-upload-excel',
  standalone: true,
  imports: [CommonModule, JsonPipe, RouterLink],
  templateUrl: './upload-excel.html',
  styleUrl: './upload-excel.css',
})
export class UploadExcel {

  excelData: any[] = [];
  selectedFile: File | null = null;   

  constructor(
    private excelUpload: UploadExcelService,
    private http: HttpClient
  ) {}

  allowedTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.ms-excel',                                          
  'text/plain',                                                        
  'text/csv',                                                          
  'application/json',                                                  
  'application/xml', 'text/xml',                                       
  'text/tab-separated-values'                                          
];

  async onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;
  this.excelData = await this.excelUpload.parseExcel(file);
  console.log("Parsed Excel Data:", this.excelData);
}

  processExcel() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);       

    this.http.post('/api/rdk/migrations', formData).subscribe({
      next: res => console.log('API OK:', res),
      error: err => console.error('API ERROR:', err)
    });
  }
}
