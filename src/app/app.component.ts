import {Component} from '@angular/core';
import {FizzBuzzComponent} from './components/fizz-buzz/fizz-buzz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FizzBuzzComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
