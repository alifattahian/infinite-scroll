import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-dynamic-scroll',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-scroll.component.html',
  styleUrl: './dynamic-scroll.component.scss'
})
export class DynamicScrollComponent implements OnInit, OnChanges, AfterViewInit {
  private INITIAL_COUNT = 8;


  private iterator: AsyncIterator<any> | undefined;
  protected list: any[] = [];

  @ViewChild("scrollArea") private scrollArea: ElementRef | undefined;
  @ViewChildren("item") private items: QueryList<ElementRef> | undefined;
  private intersectionObserver: IntersectionObserver | undefined;

  /**
   *
   */
  constructor() {


  }

  public setIterator(iterator: AsyncIterator<any>) {
    this.iterator = iterator;
    this.getInitialList();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  private ngAfterViewInitFlag = false;
  ngAfterViewInit(): void {

    if (typeof window !== 'undefined') {//Fix SSR(Server Side Rendering) Compile error
      let options = {
        root: this.scrollArea?.nativeElement,
        rootMargin: "0px",
        threshold: [0.5],
      };

      this.intersectionObserver = new IntersectionObserver(
        (entries, observer) => this.lastElementIntersectionCallback(entries, observer),
        options);

    }
    this.ngAfterViewInitFlag = true;
    this.getInitialList();

    this.items?.changes.subscribe(x => {
      this.intersectionObserver?.disconnect()

      if (this.items?.length && this.intersectionObserver) {
        let lastElement = this.items.last.nativeElement;


        this.intersectionObserver?.observe(lastElement);
      }
    })
  }




  private async getInitialList() {

    if (!this.iterator) return;
    if (!this.ngAfterViewInitFlag) return;
    this.list = [];
    for (let i = 0; i < this.INITIAL_COUNT; i++) {
      let item = await this.iterator.next();
      if (item?.done) break;
      this.list = [...this.list, item.value];
    }
  }

  private async getNextItems() {
    if (!this.iterator) return;
    if (!this.ngAfterViewInitFlag) return;

    for (let i = 0; i < this.INITIAL_COUNT; i++) {
      let item = await this.iterator.next();
      if (item?.done) break;
      this.list = [...this.list, item.value];
    }
  }

  private lastElementIntersectionCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {

    let shouldLoad = false;
    entries.forEach((entry) => {
      if (entry.rootBounds?.bottom && entry.boundingClientRect.top < entry.rootBounds?.bottom) {
        shouldLoad = true;
      }

    });

    if (shouldLoad) {
      this.getNextItems();
    }
  };
}
