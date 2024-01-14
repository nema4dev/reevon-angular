import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CriptoService} from "../../services/cripto.service";

@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrl: './decrypt.component.css',
  providers: [CriptoService],
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class DecryptComponent {
  decryptForm: FormGroup;
  selectedFile: File | undefined;

  constructor(private criptoService: CriptoService, private fb: FormBuilder) {
    this.decryptForm = this.fb.group({
      fileType: ['json', Validators.required],
      file: [null, Validators.required],
      delimiter: [',', Validators.required],
      secretKey: ['', Validators.required],
    });
  }

  handleFileInputChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  handleGenerateClick(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please choose a file to decrypt.', 'error');
    } else {
      Swal.fire({
        title: 'Enter Secret Key',
        input: 'password',
        inputPlaceholder: 'Enter your secret key',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a secret key';
          }
          return null;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { value: enteredSecretKey } = result;
          this.decryptForm.patchValue({ secretKey: enteredSecretKey });
          const id = this.generateShortId();
          this.convertToCSV(id, this.decryptForm.value.secretKey);
        }
      });
    }
  }

  convertToCSV(id: string, secret: string): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please choose a file to decrypt.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!this.selectedFile) {
        Swal.fire('Error', 'Please choose a file to decrypt.', 'error');
        return;
      }
      let convertObservable;

      const { delimiter, secretKey } = this.decryptForm.value;

      if (this.selectedFile.name.endsWith('.xml')) {
        convertObservable = this.criptoService.convertXMLToCSV(this.selectedFile, delimiter, secretKey);
      } else if (this.selectedFile.name.endsWith('.json')) {
        convertObservable = this.criptoService.convertJSONToCSV(this.selectedFile, delimiter, secretKey);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unsupported File Type',
          text: 'Only XML and JSON files are supported.',
        });
        return;
      }

      convertObservable.subscribe(
        (response) => {
          const convertedFileName = `${id}_decrypted.csv`;
          this.saveFileLocally(response, convertedFileName);
          Swal.fire({
            icon: 'success',
            title: 'File Decryption Success',
            footer: 'Decrypted File Name: ' + convertedFileName,
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'File Decryption Error',
            text: error.text,
          });
        }
      );
    };
    reader.readAsText(this.selectedFile);
  }

  saveFileLocally(content: any, fileName: string): void {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  generateShortId(): string {
    return Math.random().toString(36).substring(2, 7);
  }
}
