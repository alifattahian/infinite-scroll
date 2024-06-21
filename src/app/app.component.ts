import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicScrollComponent } from './dynamic-scroll/dynamic-scroll.component';
import { delay, timeout } from 'rxjs';
import { Post } from './model/post';
import { __asyncGenerator } from 'tslib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DynamicScrollComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  title = 'infinite-scroll';

  @ViewChild("scroller") scroller: DynamicScrollComponent | undefined;


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

    delay(1000);
    for (let i = 0; i < 1000; i++) {
      let post: Post = {
        id: i,
        description: 'description' + i
      }
      yield post;

    }


  }

}
