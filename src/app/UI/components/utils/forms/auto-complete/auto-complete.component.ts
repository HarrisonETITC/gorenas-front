import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormFieldComponentPort } from '@Application/ports/form-field.port';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IdValue } from '@Domain/models/general/id-value.interface';
import { AppUtil } from '@utils/app.util';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-auto-complete',
  imports: [MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit, AfterViewInit, FormFieldComponentPort<string | IdValue> {
  private valueManager: BehaviorSubject<string>;

  @Input({ required: false }) control?: FormControl<string | IdValue>;
  @Input({ required: false }) icon?: string;
  @Input({ required: true }) label: string;
  @Input({ required: true }) data$: Observable<Array<IdValue>>;
  @Output() updateData = new EventEmitter<Observable<string>>();
  @Output() updateValue = new EventEmitter<IdValue>();

  ngOnInit(): void {
    this.init();
  }
  ngAfterViewInit(): void {
    this.updateData.emit(this.getValue());
  }
  init(): void {
    if (AppUtil.verifyEmpty(this.control)) {
      this.control = new FormControl<string | IdValue>('', []);
    }
    let defValue = '';
    if (!AppUtil.verifyEmpty(this.control.value)) {
      defValue = (typeof this.control.value === 'string') ? this.control.value : this.control.value.value;
    }

    this.valueManager = new BehaviorSubject<string>(defValue);
    this.control.valueChanges.pipe(
      filter(val => typeof val === 'string')
    )
      .subscribe(val => this.valueManager.next(val));
  }
  getValue(): Observable<string> {
    return this.valueManager.asObservable();
  }
  verifyEmpty(val: any): boolean {
    return AppUtil.verifyEmpty(val);
  }
  displayName(value: IdValue): string {
    return value?.value ?? '';
  }
  handleOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.control.setValue(event.option.value, { emitEvent: false });
    this.updateValue.emit((this.control.value as IdValue));
  }


}
