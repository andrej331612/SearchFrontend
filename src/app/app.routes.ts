import { Routes } from '@angular/router';
import { Search } from './search/search';
import { UploadExcel } from './upload-excel/upload-excel';

export const routes: Routes = [
    { path: '', component: Search },
    { path: 'upload-excel', component: UploadExcel }
];
