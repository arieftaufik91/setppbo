import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent  {
 public progress: number;
  public message: string;
  val2: string ="tes";
  constructor(private http: HttpClient) { }

  upload(files:any) {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);
      let params = new HttpParams();
      
      params = params.append('tes', this.val2);

    const uploadReq = new HttpRequest('POST', `api/UploadFile`, formData, {
      reportProgress: true, params :params,
    });
    
    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded);
      else if (event.type === HttpEventType.Response)
        this.message = "success";
    });
  }

}
