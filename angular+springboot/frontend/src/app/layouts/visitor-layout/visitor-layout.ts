import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-visitor-layout',
  imports: [RouterOutlet, Header,Footer],
  templateUrl: './visitor-layout.html',
  styleUrl: './visitor-layout.css'
})
export class VisitorLayout {

}
