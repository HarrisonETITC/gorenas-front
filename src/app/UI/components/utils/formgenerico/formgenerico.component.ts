import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormConfig } from '@models/formulario/form-config.model';
import { FormItem } from '@models/formulario/form-item.model';
import { AppUtil } from '@utils/app.util';
import { Subscription } from 'rxjs';
import { INotificarGuardar } from 'src/app/core/interfaces/notificar-guardar.interface';

@Component({
  selector: 'app-formgenerico',
  imports: [ReactiveFormsModule, MatDialogModule, CommonModule],
  templateUrl: './formgenerico.component.html',
  styleUrl: './formgenerico.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormgenericoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) form: FormGroup;
  @Input({ required: true }) campos: Array<FormItem>;
  @Input({ required: true }) config: FormConfig;

  subs: Map<string, Subscription> = new Map();
  activo: boolean = true;
  servicio: INotificarGuardar;
  editar: boolean;

  constructor(
    private readonly dialogRef: MatDialogRef<FormgenericoComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: { form: FormGroup, campos: Array<FormItem>, config: FormConfig, servicio: INotificarGuardar, editar: boolean }
  ) { }

  ngOnInit(): void {
    if (!AppUtil.verificarVacio(this.dialogRef)) {
      this.form = this.data.form;
      this.campos = this.data.campos;
      this.config = this.data.config;
      this.servicio = this.data.servicio;
      this.editar = this.data.editar ?? false;
    }
  }

  ngAfterViewInit(): void {
    for (const campo of this.campos) {
      if (campo.tipo == FormItem.TIPO_AUTOCOMPLETE) {
        const field = this.form.get(campo.id);
        campo.activarPanel = false;
        this.activarSuscripcion(campo, field)
      }
    }

    this.dialogRef.beforeClosed().subscribe(() => {
      this.campos.forEach((campo) => {
        const control = this.form.get(campo.id)

        if (!AppUtil.verificarVacio(control))
          control.setValue(null, { emitEvent: false })

      });
    })
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

  cambiarValor(campo: string, valor: any, adicional?: string) {
    const encontrado = this.campos.find((c) => c.id == campo)
    if (!AppUtil.verificarVacio(encontrado) && encontrado.tipo == FormItem.TIPO_AUTOCOMPLETE) {
      encontrado.activarPanel = false;
      this.form.get(campo).setValue(adicional, { emitEvent: false });
      encontrado.valorAutoComplete = { valor: adicional, id: valor };

      return;
    }
    this.form.get(campo).setValue(valor, { emitEvent: false });
  }

  activarSuscripcion(campo: FormItem, field: AbstractControl) {
    const nuevaSub = field.valueChanges.subscribe(
      (valor: string) => {
        campo.activarPanel = true;
        campo.autocompleteHandler.next(valor)
      }
    )
    this.subs.set(campo.id, nuevaSub);
  }

  notificarComponente() {
    if (this.form.valid) {
      if (!this.editar)
        this.servicio.notificarGuardar();
      else
        this.servicio.notificarEditar();
    }
    else
      alert('El formulario tiene errores')
  }
}
