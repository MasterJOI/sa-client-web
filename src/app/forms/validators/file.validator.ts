import {FormControl} from '@angular/forms';

//file validation
const maxSize: number = 100; //100 Mb
const acceptedFileTypes: string[] = ['pdf', 'doc', 'docx'];

export function fileValidator(file: FormControl): { [p: string]: boolean } | null {
  if (file.value) {
    if (maxSize < (file.value.size / (1024 * 1024))) {
      return {'fileToBig': true};
    }
    const type: string = file.value.name.split('.').pop();
    if (acceptedFileTypes.indexOf(type.trim().toLowerCase()) === -1) {
      return {'wrongType': true};
    }
  }
  return null;
}
