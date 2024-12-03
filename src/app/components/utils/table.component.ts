import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T extends { id: number }> {
  @Input() cabeceras$: Observable<Array<string>>;
  @Input() informacion$: Observable<Array<T>>;
}
