import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Excel } from '../service/excel';


@Component({
  selector: 'app-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  //Form Imputs
  public searchText : string = '';
  public serialNumber : string = '';
  public status : string = '';
  public lineId : string = '';

  //Results
  public results : any[] = [];
  public filteredData: any[] = [];

  //Pagination
  public currentPage = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10, 20, 50];

  loading = false;
  error: string | null = null;

  private readonly apiUrl = 'https://a45e4226-5d59-4e67-ada3-8ea212960be3.mock.pstmn.io/api/rdk/migrations';


  constructor(private http: HttpClient,
              private excelService: Excel
  ) {}

  search() {
    this.loading = true;
    this.error = null;

    let params = new HttpParams();
    if (this.serialNumber) params = params.set('serialNumber', this.serialNumber);
    if (this.lineId) params = params.set('lineId', this.lineId);
    if (this.status) params = params.set('status', this.status);

    this.http.get<any[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
        this.currentPage=1;
        this.filteredData=this.paginateData();
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Failed to load data';
        this.loading = false;
      }
    });
  }

  //Clear Button
  clear(){
    this.results = [];
    this.filteredData = [];
    this.searchText = "";
    this.serialNumber ="";
    this.lineId = "";
    this.status = "";
    this.currentPage = 0;
  }

  // Pagination logic
  paginateData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.results.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.results.length) {
      this.currentPage++;
      this.filteredData = this.paginateData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredData = this.paginateData();
    }
  }

  /** Change page size */
  onPageSizeChange() {
    this.currentPage = 1;
    this.filteredData = this.paginateData();
  }
  
  exportJson(): void {
  this.excelService.exportAsExcelFile(this.results, 'Search-Results');
}
}
