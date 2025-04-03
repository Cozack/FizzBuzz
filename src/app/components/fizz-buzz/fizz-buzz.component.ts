import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Subscription} from 'rxjs';

@Component({
  selector: 'app-fizz-buzz',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './fizz-buzz.component.html',
  styleUrl: './fizz-buzz.component.scss'
})
export class FizzBuzzComponent implements OnInit, OnDestroy {
  private countSubject = new BehaviorSubject<number>(0);
  private filterSubject = new BehaviorSubject<string>('');
  private numbersSubject = new BehaviorSubject<(number | string)[]>([]);
  private subscription: Subscription = new Subscription();

  filteredArray = combineLatest([
    this.numbersSubject,
    this.filterSubject.pipe(debounceTime(500), distinctUntilChanged())
  ]).pipe(
    map(([numbers, filter]) =>
      filter ? numbers.filter(item => item.toString().includes(filter)) : numbers
    )
  );

  constructor() {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.countSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(count => this.generateArray(count))
    );
  }

  setCount(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const count = parseInt(value, 10) || 0;
    this.countSubject.next(count);
  }

  setFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterSubject.next(value);
  }

  generateArray(count: number): void {
    const numbers = Array.from({length: count}, (_, i) => this.transformNumber(i + 1));
    this.numbersSubject.next(numbers);
  }

  addElements(): void {
    const currentNumbers = this.numbersSubject.getValue();
    const start = currentNumbers.length + 1;
    const newNumbers = Array.from({length: 15}, (_, i) => this.transformNumber(start + i));
    this.numbersSubject.next([...currentNumbers, ...newNumbers]);
  }

  transformNumber(num: number): string | number {
    if (num % 3 === 0 && num % 5 === 0) return 'FizzBuzz';
    if (num % 3 === 0) return 'Fizz';
    if (num % 5 === 0) return 'Buzz';
    return num;
  }

  isEven(value: number | string): boolean {
    return typeof value === 'number' && value % 2 === 0;
  }

  trackById(index: number, item: number | string): any {
    return item;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
