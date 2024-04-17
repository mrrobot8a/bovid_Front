import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: [
  ]
})
export class RegisterPageComponent {
  pdfUrl: any = '';

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getPdf();
  }

  getPdf() {
    this.getPdfUrl().subscribe(
      (response: any) => {
        console.log(response);
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));

      },
      (error) => {
        console.error('Error fetching PDF:', error);
        // Handle error, e.g., show an error message to the user
      }
    );
  }

  getPdfUrl(): Observable<Blob> {
    const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0VuYWJsZWQiOnRydWUsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwicm9sZXMiOiJBZG1pbmlzdHJhZG9yIiwiZnVsbG5hbWUiOiJhbmRlcnNvbiBwZXJhbHRhIiwiaWF0IjoxNzEyOTc1ODg2LCJleHAiOjE3MTI5ODMwODZ9.2eT2m3wcRbn8d8ac6ko8eUTD2qS6lW_nnM0z_lnkIAc';

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('http://localhost:8000/admin/support-document/ver-pdf/21b5ef52-4a89-41f5-a138-e1e6fdd388a5_actividaddevopr.pdf', {
      headers: headers,
      responseType: 'blob'
    });
  }


}
