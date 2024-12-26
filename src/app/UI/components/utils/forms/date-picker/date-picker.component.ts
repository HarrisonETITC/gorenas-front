import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { dateValidator } from '@UI/forms/validators/date.validator';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormFieldComponentPort } from '@Application/ports/forms/form-field.port';
import { FormsUtil } from '@utils/forms.util';

@Component({
  selector: 'app-date-picker',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [provideNativeDateAdapter()]
})
export class DatePickerComponent implements OnInit, AfterViewInit, FormFieldComponentPort<Date> {
  private valueManager: BehaviorSubject<Date>;
  @Input({ required: false }) isTransparent?: boolean;
  @Input({ required: false }) control?: FormControl<any>;
  @Input({ required: true }) label: string;
  @Output() updateData: EventEmitter<Observable<Date>> = new EventEmitter();
  @Output() updateValue: EventEmitter<Date> = new EventEmitter();

  ngOnInit(): void {
    this.init();
  }
  ngAfterViewInit(): void {
    this.updateData.emit(this.getValue());
  }
  init(): void {
    if (AppUtil.verifyEmpty(this.control)) {
      this.control = new FormControl<Date>(new Date(), [dateValidator()]);
    }
    this.valueManager = new BehaviorSubject<Date>(this.control.value);

    this.control.valueChanges.pipe(
      map(val => new Date(val)),
      filter(val => {
        return !AppUtil.verifyEmpty(val)
      })
    ).subscribe(date => {
      this.valueManager.next(date)
      this.updateValue.emit(date);
    })
  }
  getValue(): Observable<Date> {
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
