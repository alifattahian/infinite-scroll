import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicScrollComponent } from './dynamic-scroll/dynamic-scroll.component';
import { delay, firstValueFrom, timeout } from 'rxjs';
import { Post } from './model/post';
import { __asyncGenerator } from 'tslib';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { error } from 'console';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DynamicScrollComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  title = 'infinite-scroll';

  @ViewChild("scroller") scroller: DynamicScrollComponent | undefined;

  constructor(private postService: PostService) {

  }


  ngAfterViewInit() {

    if (this.scroller) {
      let list = this.getList();
      this.scroller.setIterator(this.convertGeneratorToIterator(list));
    }
  }

  convertGeneratorToIterator<T>(generator: AsyncGenerator<T>): AsyncIterator<T> {

    let iterator: AsyncIterator<T> = {

      next: (): Promise<IteratorResult<T>> => {

        let obj: Promise<IteratorResult<T>> = generator.next();
        return obj;


      },
      return: (value): Promise<IteratorResult<T>> => {
        return generator.return(value);
      }

    };


    return iterator;
  }
  async *getList(): AsyncGenerator<Post> {

    let pageNumber = 1;
    let posts: Post[] | undefined = [];
    do {

      posts = await firstValueFrom(this.postService.getPost(pageNumber));
      pageNumber++;
      if (posts && posts.length) {
        for (let post of posts) {
          yield post;
        }
      }
    } while (posts && posts.length)


  }

}
