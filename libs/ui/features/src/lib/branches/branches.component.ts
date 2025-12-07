import { Component, Inject, OnInit } from '@angular/core';
import { ApiServicePort, BaseDataConfig, BRANCH_SERVICE, UseBaseDataComponent } from '@gorenas/application-core';
import { BaseDataComponent } from '@gorenas/ui-commons';
import { AppModel, BranchModel, BtnConfig, TableConfig, BranchModelView, FormField } from '@gorenas/domain';
import { FormDataConfig, BranchFilter, BranchForms } from '@gorenas/shared-util-forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-branches',
  imports: [BaseDataComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit, UseBaseDataComponent {
  protected readonly moduleName = AppModel.MODULE_BRANCHES;
  protected actionHandlers: Map<string, (element: BranchModel) => void>;
  pageConfig: BaseDataConfig;
  headers: Map<string, string>;
  filterFields: FormField[] = BranchFilter.FIELDS;

  constructor(
    @Inject(BRANCH_SERVICE)
    protected readonly service: ApiServicePort<BranchModel, BranchModelView>
  ) { 
    this.initActionHandlers();
  }

  ngOnInit(): void {
    this.headers = BranchModelView.headers;
    this.pageConfig = new BaseDataConfig('Sucursales', 'Crear Sucursal');
  }
  getInitFilter(): Observable<BranchFilter> {
    return of(null);
  }
  getForms(): Array<FormDataConfig> {
    const createForm = BranchForms.CREATE_FORM;
    createForm.dataInitializer = this.service;

    return [createForm];
  }
  initFilters(data: any): void {
    throw new Error('Method not implemented.');
  }
  getTableConfig(): TableConfig {
    return {
      buttons: [
        BtnConfig.BASIC_EDIT_CONFIG,
        BtnConfig.BASIC_DISABLE_CONFIG,
      ]
    }
  }

  private initActionHandlers(): void {
    this.actionHandlers = new Map();
    
    // ✅ NO necesitamos definir 'edit' - BaseDataComponent lo maneja automáticamente
    // con su acción base que navega al formulario de edición
    
    // ✅ Solo definimos acciones específicas de sucursales
    this.actionHandlers.set('disable', (branch: BranchModel) => {
      console.log('Deshabilitando sucursal:', branch.name);
      if (confirm(`¿Está seguro de deshabilitar la sucursal "${branch.name}"?`)) {
        const updatedBranch = { ...branch, active: false };
        this.service.modify(updatedBranch).subscribe(() => {
          console.log('Sucursal deshabilitada exitosamente');
        });
      }
    });

    // ✅ Sobrescribir 'view' con comportamiento específico para sucursales
    this.actionHandlers.set('view', (branch: BranchModel) => {
      console.log('Viewing branch details:', branch.name);
      // Aquí podrías navegar a una vista detallada específica
      // this.router.navigate(['/branch-details', branch.id]);
    });

    // ✅ Acción completamente nueva
    this.actionHandlers.set('clone', (branch: BranchModel) => {
      console.log('Clonando sucursal:', branch.name);
      const clonedBranch = { ...branch, name: `${branch.name} - Copia`, id: undefined };
      this.service.create(clonedBranch).subscribe(() => {
        console.log('Sucursal clonada exitosamente');
      });
    });
  }
}
