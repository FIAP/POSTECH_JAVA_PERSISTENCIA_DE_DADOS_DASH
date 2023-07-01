import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError, retryWhen, delay, take } from 'rxjs/operators';

class HttpUtilService {

  constructor() { }

  extrairDados(response: any) {
    const data = response;
    console.log(data);
    return data || {};
  }

  processarErros(erro: any) {
    return throwError(() => new Error(erro))
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashService {
constructor(private http: HttpClient, private httpUtil: HttpUtilService ) { }

private API_URL = "http://localhost:8080/";

getNews() {
  return this.http.get(this.API_URL + 'news')
    .pipe(map(this.httpUtil.extrairDados))
    .pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(10))),
      catchError(this.httpUtil.processarErros));
}

}