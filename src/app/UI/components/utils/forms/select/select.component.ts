import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFieldComponentPort } from '@Application/ports/form-field.port';
import { ViewValue } from '@Domain/types/view-value.type';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppUtil } from '@utils/app.util';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent implements OnInit, AfterViewInit, FormFieldComponentPort<string> {
  private valueManager: BehaviorSubject<string>;
  @Input({ required: false }) control?: FormControl<string>;
  @Input({ required: true }) label: string;
  @Input({ required: true }) values: Array<ViewValue>;
  @Input({ required: false }) icon?: string;
  @Output() updateData: EventEmitter<Observable<string>> = new EventEmitter();
  @Output() updateValue: EventEmitter<string> = new EventEmitter();

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
    this.control.valueChanges.pipe(
      tap(() => this.control.updateValueAndValidity({ emitEvent: false }))
    )
      .subscribe(val => {
        this.updateValue.emit(val);
        this.valueManager.next(val);
      });
  }
  getValue(): Observable<string> {
    return this.valueManager.asObservable();
  }
  verifyEmpty(val: any): boolean {
    return AppUtil.verifyEmpty(val);
  }
}
