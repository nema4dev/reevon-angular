import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        NgOptimizedImage,
        NgClass
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isEncryptActive: boolean = true;
  isDecryptActive: boolean = false;
  constructor(private router: Router) {}

  navigateToEncrypt() {
    this.router.navigate(['/encrypt']);
    this.isEncryptActive = true;
    this.isDecryptActive = false;
  }

  navigateToDecrypt() {
    this.router.navigate(['/decrypt']);
    this.isEncryptActive = false;
    this.isDecryptActive = true;
  }
}
