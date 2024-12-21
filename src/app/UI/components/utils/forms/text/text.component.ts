import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponentPort } from '@Application/ports/form-field.port';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-text',
  imports: [MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css'
})
export class TextComponent implements OnInit, AfterViewInit, FormFieldComponentPort<string | number> {
  private valueManager: BehaviorSubject<string>;
  @Input({ required: false }) control?: FormControl<string>;
  @Input({ required: true }) label: string;
  @Input({ required: false }) icon?: string;
  @Input({ required: true }) type: 'text' | 'number' | 'password';

  showPass: boolean = false;

  ngOnInit(): void {
    this.init();
  }
  ngAfterViewInit(): void {
    this.valueManager = new BehaviorSubject<string>(this.control.value);
  }
  init(): void {
    if (AppUtil.verifyEmpty(this.control)) {
      this.control = new FormControl<string>('', []);
    }
    this.control.valueChanges.subscribe(val => this.valueManager.next(val));
  }
  getValue(): Observable<string> {
    return this.valueManager.asObservable();
  }
  verifyEmpty(val: any): boolean {
    return AppUtil.verifyEmpty(val);
  }

}
