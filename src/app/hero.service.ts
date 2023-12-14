import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

type Severity = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'http://localhost:8080/api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  httpPhotoOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' })
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes', 'success')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`, 'error');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`, 'success')),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string, severity: Severity) {
    this.messageService.add({
      severity: severity, 
      summary: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Message`, // Capitalize the first letter of severity
      detail: message,
      life: 3000 
    });
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`, 'success')),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`added hero w/ id=${hero.id}`, 'success')),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHeroPhoto(photo: File, id: number): Observable<File>{
    return this.http.put<File>(this.heroesUrl + "/photo/" + id + "/" + photo.name, this.httpPhotoOptions).pipe(
      tap(_ => this.log(`uploaded photo`, 'success')),
      catchError(this.handleError<File>('addHero'))
    );
  }

  uploadHeroPhoto(photo: File, id: number): Observable<File>{
    return this.http.post<File>(this.heroesUrl + "/photo/" + id + "/"  + photo.name, photo, this.httpPhotoOptions).pipe(
      tap(_ => this.log(`uploaded photo`, 'success')),
      catchError(this.handleError<File>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`, 'success')),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`, 'success') :
        this.log(`no heroes matching "${term}"`, 'info')),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

}
