import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'labour-party-logo';

  @ViewChild('img') elem!: ElementRef<HTMLInputElement>;
  @ViewChild('imageDisplay') imageDisplay!: ElementRef<HTMLImageElement>;
  

  constructor(private utilServ: UtilService) {
  }

  imageInput!: FormGroup;

  ngOnInit(): void {
    this.imageInput = new FormGroup({
      image: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    })

    this.imageInput.get(['image'])?.valueChanges.subscribe({
      next: (value: any) => {
        // console.log('new image', value);
        
      },
      error: (err: any) => {
        // maybe show an error message
        console.log('errrr', err);
        
      }
    })
  }

  ngAfterViewInit(): void {
    this.elem.nativeElement.addEventListener('change', (e: any) => {
      console.log('vvv', e);

      console.log('ee?', e.target.files);

      // get a reference to the file
      const file = e.target.files[0];

      // encode the file using the FileReader API
      const reader = new FileReader();
      reader.onloadend = () => {

          // use a regex to remove data url part
          let base64String = reader.result
          // ?.replace('data:', '')?.replace(/^.+,/, '');
          if (typeof reader.result == 'string') {
            base64String = reader.result
              ?.replace('data:', '')?.replace(/^.+,/, '');
          }
          console.log('got it');

          try {


            if (this.imageInput.contains('image')) { // check that the form group has the file formControl
              this.imageInput.get('image')?.setValue(base64String)
            } else { // create the formControl
              this.imageInput.addControl('image', new FormControl(base64String, [Validators.required]))
            }

            if (this.imageInput.get('image')?.hasError('required')) {
              // delete the required error
              delete this.imageInput.get('image')?.errors?.required;
              this.imageInput.get('image')?.updateValueAndValidity();
            }
            
            
          } catch (error) {
            console.error('ERROR ishhh:', error);
          }
      };
      reader.readAsDataURL(file);
      
    })
  }


  uploadImage(): void {
    if (this.imageInput.valid) {
      this.utilServ.createImage(this.imageInput.value).subscribe({
        next: (res: any) => {
          console.log('what??', res);

          this.imageDisplay.nativeElement.src = res.body.image
          
        },
        error: (err: any) => {
          console.log('heeloo err', err);
          
        }
      })
    } else {
      
    }
  }
}
