import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CriptoService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postData(endpoint: string, formData: FormData, options?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${endpoint}`, formData, options);
  }

  convertToXML(file: File, separator: string, secret: string): Observable<any> {
    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('separator', separator);
    formData.append('key', secret);

    return this.postData('/document/xml', formData, { responseType: 'text' });
  }

  convertToJSON(file: File, separator: string, secret: string): Observable<any> {
    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('separator', separator);
    formData.append('key', secret);

    return this.postData('/document/json', formData, { responseType: 'json' });
  }


  convertXMLToCSV(file: any , separator: string, secret: string): Observable<any> {
    const formData = new FormData();
    console.log("file:",file);
    formData.append('document', file, file.name);
    formData.append('separator', separator);
    formData.append('key', secret);

    return this.postData('/document/CsvXml', formData,{ responseType: 'text' });
  }

  convertJSONToCSV(file: any , separator: string, secret: string): Observable<any> {
    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('separator', separator);
    formData.append('key', secret);

    return this.postData('/document/CsvJson', formData, { responseType: 'text' });
  }
}
