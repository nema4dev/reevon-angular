import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CriptoService } from '../../services/cripto.service';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css'],
  providers: [CriptoService],
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class EncryptComponent {
  encryptForm: FormGroup;
  selectedFile: File | undefined;

  constructor(private criptoService: CriptoService, private fb: FormBuilder) {
    this.encryptForm = this.fb.group({
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No file selected',
      });
      return;
    }

    if (this.selectedFile.type !== 'text/csv') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a CSV file for encryption.',
      });
      return;
    }

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
    })
      .then((result) => {
        if (result.isConfirmed) {
          const { value: enteredSecretKey } = result;
          this.encryptForm.patchValue({ secretKey: enteredSecretKey });

          const { fileType, delimiter, secretKey } = this.encryptForm.value;
          const id = this.generateShortId();

          if (fileType === 'xml') {
            this.convertFileToXML(id, secretKey, delimiter);
          } else if (fileType === 'json') {
            this.convertFileToJSON(id, secretKey, delimiter);
          }
        }
      })
      .catch((error) => {
        console.error('Error during SweetAlert2 operation:', error);
      });
  }

  convertFileToXML(id: string, secretKey: string, delimiter: string): void {
    if (this.selectedFile) {
      this.criptoService.convertToXML(this.selectedFile, delimiter, secretKey).subscribe(
        (xmlContent) => {
          const convertedFileName = `${id}_encrypted.xml`;
          this.saveFileLocally(xmlContent, convertedFileName);
        },
        (error) => {
          console.error('Error encrypting file to XML', error);
        }
      );
    }
  }

  convertFileToJSON(id: string, secretKey: string, delimiter: string): void {
    if (this.selectedFile) {
      this.criptoService.convertToJSON(this.selectedFile, delimiter, secretKey).subscribe(
        (jsonContent) => {
          const convertedFileName = `${id}_encrypted.json`;
          this.saveFileLocally(JSON.stringify(jsonContent), convertedFileName);
        },
        (error) => {
          console.error('Error encrypting file to JSON', error);
        }
      );
    }
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
