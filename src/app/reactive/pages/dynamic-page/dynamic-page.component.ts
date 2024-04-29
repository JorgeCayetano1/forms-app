import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: ``,
})
export class DynamicPageComponent {
  public dynamicForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],
    ]),
  });

  public newFavorite: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder) {}

  get favoriteGames() {
    return this.dynamicForm.get('favoriteGames') as FormArray;
  }

  isValidField(field: string): boolean | null {
    return (
      this.dynamicForm.controls[field].errors &&
      this.dynamicForm.controls[field].touched
    );
  }

  isValidFieldArray(formArray: FormArray, index: number): boolean | null {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  getFieldError(field: string): string | null {
    if (
      !this.dynamicForm.controls[field] &&
      this.dynamicForm.controls[field].errors
    )
      return null;
    const errors = this.dynamicForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `El campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }

  onAddToFavorites(): void {
    if (this.newFavorite.invalid) return;

    const newFavorite = this.newFavorite.value;
    // this.favoriteGames.push(new FormControl(newFavorite, Validators.required));
    this.favoriteGames.push(this.fb.control(newFavorite, Validators.required));
    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number): void {
    this.favoriteGames.removeAt(index);
  }

  onSubmit(): void {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    console.log(this.dynamicForm.value);
    (this.dynamicForm.controls['favoriteGames'] as FormArray) = this.fb.array(
      []
    );
    this.dynamicForm.reset();
  }
}
