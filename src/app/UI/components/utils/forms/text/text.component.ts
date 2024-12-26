import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponentPort } from '@Application/ports/forms/form-field.port';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsUtil } from '@utils/forms.util';

@Component({
  selector: 'app-text',
  imports: [MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css'
})
export class TextComponent implements OnInit, AfterViewInit, FormFieldComponentPort<string | number> {
  private valueManager: BehaviorSubject<string>;
  @Input({ required: false }) isTransparent?: boolean;
  @Input({ required: false }) control?: FormControl<string>;
  @Input({ required: true }) label: string;
  @Input({ required: false }) icon?: string;
  @Input({ required: true }) type: 'text' | 'number' | 'password';
  @Output() updateData: EventEmitter<Observable<string | number>> = new EventEmitter();
  @Output() updateValue: EventEmitter<string | number> = new EventEmitter();

  showPass: boolean = false;

  ngOnInit(): void {
    this.init();
  }
  ngAfterViewInit(): void {
    this.updateData.emit(this.getValue());
  }
  init(): void {
    if (AppUtil.verifyEmpty(this.control)) {
      this.control = new FormControl<string>('', []);
    }
    this.valueManager = new BehaviorSubject<string>(this.control.value);
    this.control.valueChanges.subscribe(val => {
      this.updateValue.emit(val);
      this.valueManager.next(val)
    });
  }
  getValue(): Observable<string> {
    return this.valueManager.asObservable();
  }
  verifyEmpty(val: any): boolean {
    return AppUtil.verifyEmpty(val);
  }
  getTransparentClass(): string {
    return this.isTransparent ? 'transparent' : '';
  }
  getErrorMessage(): string {
    return FormsUtil.errorMessage(null, null, this.control);
  }
}
