import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { InputFileComponent } from './Components/input-file/input-file.component';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,
    FormsModule, 
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'QueryDocs';
}
