import { Component } from '@angular/core';
import { VisitorLayout } from './layouts/visitor-layout/visitor-layout';

@Component({
  selector: 'app-root',
  imports: [VisitorLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
}
