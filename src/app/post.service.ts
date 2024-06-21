import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Post } from './model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  getPost(pageNumber: number): Observable<Post[] | undefined> {
    if (typeof window !== 'undefined') {
      return this.httpClient.get<any>(`http://localhost:3000/posts?_page=${pageNumber}&_per_page=5`).pipe(map(respones => {
        return respones['data'] as Post[];
      }));
    }
    return of(undefined);
  }
}
