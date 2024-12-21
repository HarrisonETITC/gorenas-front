import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormFieldComponentPort } from '@Application/ports/form-field.port';
import { ViewValue } from '@Domain/types/view-value.type';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, Observable } from 'rxjs';
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
