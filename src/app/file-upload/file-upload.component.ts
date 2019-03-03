import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  files: UploadFile[] = [];
  httpUrl = 'http://localhost:8080/file/upload';

  afuConfig = {
    multiple: true,
    formatsAllowed: '.jpg,.png,.tiff',
    maxSize: '1',
    uploadAPI: {
      url: 'http://localhost:8080/file/upload'
    },
    theme: 'dragNDrop',
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !'
    }
  };
  isUploading = false;
  progressPercentage: number;
  previewUrl: string;
  private fileUploadSubscription: Subscription;
  private loaded: number;
  private total: number;
  @Output()
  onUpload = new EventEmitter();


  constructor(private httpClient: HttpClient, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }


  public dropped(event: UploadEvent) {
    this.files = event.files;
    if (this.files.length !== 1) {
      return;
    }
    for (const droppedFile of this.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (this.isSupported(file)) {
            if (this.isImage(file)) {
              const reader = new FileReader();
              reader.onload = (f => this.previewUrl = f.target.result);
              reader.readAsDataURL(file);
            }
            this.upload(file);
          }

        });
      }
    }
  }

  public fileOver(event) {
  }

  public fileLeave(event) {
  }

  private upload(file: File): void {
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.fileUploadSubscription = this.httpClient.post(this.httpUrl, formData, {
      headers: new HttpHeaders(),
      observe: 'events',
      params: new HttpParams(),
      reportProgress: true,
      responseType: 'json'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressPercentage = Math.floor(event.loaded * 100 / event.total);
        this.total = event.total;
        this.loaded = event.loaded;
        this.changeDetector.detectChanges();
      } else if (event.type === HttpEventType.Response) {
        this.isUploading = false;
        this.onUpload.emit({file: file, event: event});
      }
      this.changeDetector.detectChanges();
    }, (error: any) => {
      console.log(error);
      if (this.fileUploadSubscription) {
        this.fileUploadSubscription.unsubscribe();
      }
      this.isUploading = false;
      this.onUpload.emit({file: file, event: event});
    });
  }

  private isImage(file: File): boolean {
    return file.name.endsWith('.jpg') ||
      file.name.endsWith('.JPG') ||
      file.name.endsWith('.JPEG') ||
      file.name.endsWith('.jpeg') ||
      file.name.endsWith('.PNG') ||
      file.name.endsWith('.png') ||
      file.name.endsWith('.tiff') ||
      file.name.endsWith('.TIFF');
  }

  private isSupported(file: File): boolean {
    return this.isImage(file) ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.PDF');
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
