import { Routes } from '@angular/router';
import { EncryptComponent } from './pages/encrypt/encrypt.component';
import { DecryptComponent } from './pages/decrypt/decrypt.component';

export const routes: Routes = [
  { path: '', redirectTo: '/encrypt', pathMatch: 'full' },
  { path: 'encrypt', component: EncryptComponent },
  { path: 'decrypt', component: DecryptComponent },
];
