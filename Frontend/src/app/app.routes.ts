import { Routes } from '@angular/router';
import { InputFileComponent } from './Components/input-file/input-file.component';
import { PromptComponent } from './Components/prompt/prompt.component';

export const routes: Routes = [ { path: '', component: InputFileComponent },
    { path: 'prompt', component: PromptComponent }];
