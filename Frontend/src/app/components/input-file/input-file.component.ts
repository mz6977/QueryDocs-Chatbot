import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap'; // Import Bootstrap's Modal class

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent {
  selectedFile: File | null = null; // Tracks the selected file
  isLoading: boolean = false; // Tracks the loading state
  successMessage: string = ''; // Stores the success message

  constructor(private http: HttpClient, private router: Router) {}

  // Handles file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.successMessage = ''; // Clear any previous success message
  }

  // Submits the file to the backend
  submitFile(): void {
    if (this.selectedFile) {
      this.isLoading = true; // Show the loading indicator
      this.successMessage = ''; // Clear any previous success message

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('http://127.0.0.1:5000/upload', formData).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          this.isLoading = false; // Hide the loading indicator
          this.successMessage = 'File uploaded successfully!'; // Show success message

          // Dismiss the modal programmatically
          const modalElement = document.getElementById('uploadModal');
          if (modalElement) {
            const bootstrapModal = Modal.getInstance(modalElement); // Use Bootstrap's Modal class
            bootstrapModal?.hide();
          }

          // Navigate to the prompt page after successful file submission
          this.router.navigate(['/prompt']);
        },
        (error) => {
          this.isLoading = false; // Hide the loading indicator
          console.error('Error uploading file:', error);
          alert('Failed to upload file. Please try again.');
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }
}