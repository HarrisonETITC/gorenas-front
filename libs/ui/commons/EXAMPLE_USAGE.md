# Ejemplos de Uso del Nuevo Sistema de Acciones Base

## Ejemplo Completo de Implementación

```typescript
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseDataComponent, BaseDataActions } from '@gorenas/ui-commons';
import { ApiServicePort, BaseDataConfig } from '@gorenas/application-core';
import { BranchModel, BranchModelView, BtnConfig, TableConfig } from '@gorenas/domain';

@Component({
  selector: 'app-example',
  imports: [BaseDataComponent],
  template: `
    <app-base-data
        [pageConfig]="pageConfig"
        [service]="service"
        [headers]="headers"
        [tableConfig]="getTableConfig()"
        [dataForms]="getForms()"
        [initFilter$]="getInitFilter()"
        [actionHandlers]="actionHandlers"
        [enableDefaultActions]="true">
    </app-base-data>
  `
})
export class ExampleComponent implements OnInit {
  protected actionHandlers: Map<string, (element: BranchModel) => void>;

  constructor(
    @Inject('BRANCH_SERVICE')
    protected readonly service: ApiServicePort<BranchModel, BranchModelView>,
    private readonly router: Router,
    private readonly exportService: ExportService
  ) {
    this.initActionHandlers();
  }

  /**
   * ESCENARIO 1: Uso mínimo - Solo acciones base
   * - No necesitas definir actionHandlers
   * - edit/create funcionan automáticamente
   */
  // actionHandlers = undefined; ← Las acciones base funcionan automáticamente

  /**
   * ESCENARIO 2: Acciones personalizadas + acciones base
   * - Define solo las acciones específicas que necesitas
   * - edit/create siguen funcionando automáticamente
   */
  private initActionHandlers(): void {
    this.actionHandlers = new Map();
    
    // ✅ 'edit' y 'create' no necesitan definirse - BaseDataComponent las maneja
    
    // ✅ Solo definir acciones específicas del dominio
    this.actionHandlers.set('disable', (branch: BranchModel) => {
      if (confirm(`¿Deshabilitar "${branch.name}"?`)) {
        this.service.modify({ ...branch, state: 'inactive' }).subscribe();
      }
    });

    // ✅ Sobrescribir acción base si necesitas comportamiento específico
    this.actionHandlers.set(BaseDataActions.BASE_ACTIONS.VIEW, (branch: BranchModel) => {
      // Comportamiento personalizado para ver sucursales
      this.router.navigate(['/branch-details', branch.id]);
    });

    // ✅ Acciones completamente nuevas
    this.actionHandlers.set('export', (branch: BranchModel) => {
      this.exportService.exportBranch(branch).subscribe();
    });
  }

  /**
   * ESCENARIO 3: Control total - Deshabilitar acciones base
   */
  private useOnlyCustomActions(): void {
    // En template: [enableDefaultActions]="false"
    this.actionHandlers = new Map();
    
    // Ahora DEBES definir todas las acciones, incluyendo 'edit'
    this.actionHandlers.set('edit', (branch: BranchModel) => {
      // Tu implementación personalizada para edit
      this.router.navigate(['./form', branch.id], { relativeTo: this.route });
    });
  }

  getTableConfig(): TableConfig {
    return {
      buttons: [
        // ✅ Estos botones funcionan automáticamente con acciones base
        BtnConfig.BASIC_EDIT_CONFIG,     // ← action: 'edit'
        
        // ✅ Acciones personalizadas requieren configuración de botones
        new BtnConfig('disable', 'Deshabilitar', 'block'),
        new BtnConfig('export', 'Exportar', 'download'),
        
        // ✅ Acción base sobrescrita
        new BtnConfig(BaseDataActions.BASE_ACTIONS.VIEW, 'Ver Detalles', 'visibility')
      ]
    };
  }

  // ... resto de métodos requeridos por UseBaseDataComponent
}
```

## Comparación de Escenarios

### 1. **Escenario Básico: Solo Acciones Base**

```typescript
// ❌ ANTES: Tenías que definir el handler
this.actionHandlers.set('edit', (item) => this.goUpdate(item.id));

// ✅ AHORA: No necesitas hacer nada
// <app-base-data ...> ← edit funciona automáticamente
```

### 2. **Escenario Híbrido: Base + Personalizadas**

```typescript
// ✅ AHORA: Solo define lo específico
this.actionHandlers = new Map();
// edit/create → Automático via acciones base
// Solo defines acciones específicas:
this.actionHandlers.set('clone', (item) => { ... });
this.actionHandlers.set('export', (item) => { ... });
```

### 3. **Escenario Avanzado: Control Total**

```typescript
// ✅ AHORA: Control granular
[enableDefaultActions]="false"  // Deshabilitar acciones base
// Defines TODAS las acciones manualmente
```

## Beneficios Demostrados

### ✅ **Reducción de Código**
```typescript
// ❌ ANTES: 5-10 líneas por acción base
// ✅ AHORA: 0 líneas (automático)
```

### ✅ **Flexibilidad Total**
```typescript
// Nivel 1: Sin configuración → edit/create automático
// Nivel 2: Configuración híbrida → Base + específicas  
// Nivel 3: Control total → Solo personalizadas
```

### ✅ **Escalabilidad**
```typescript
// Agregar nueva acción base → No afecta features existentes
// Features existentes → Siguen funcionando sin cambios
// Nuevos features → Máxima flexibilidad
```
