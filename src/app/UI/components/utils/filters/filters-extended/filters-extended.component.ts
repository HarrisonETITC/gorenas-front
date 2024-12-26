import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBaseComponent } from '@components/utils/forms/form-base/form-base.component';
import { FormItemModel } from '@Domain/models/forms/form-item.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-filters-extended',
  imports: [ReactiveFormsModule, FormBaseComponent, MatIconModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './filters-extended.component.html',
  styleUrl: './filters-extended.component.css'
})
export class FiltersExtendedComponent implements OnInit {
  private readonly outputEventHandler = new BehaviorSubject<any>({});
  @Input({ required: true }) fields: Array<FormItemModel>;
  @Output() searchHandler = new EventEmitter<Observable<any>>();
  @ViewChild(FormBaseComponent) formBase: FormBaseComponent;
  protected autoSearch: boolean = false;

  ngOnInit(): void {
    this.searchHandler.emit(this.outputEventHandler.asObservable());
  }

  protected sendSearchEvent() {
    const send = this.formBase.buildObjectFromForm();
    this.outputEventHandler.next(send);
  }

  protected handleEvents() {
    if (this.autoSearch && this.formBase.form.valid)
      this.sendSearchEvent();
  }

  protected setDefaultValues() {
    this.formBase.resetDefaultValues();
  }
}
