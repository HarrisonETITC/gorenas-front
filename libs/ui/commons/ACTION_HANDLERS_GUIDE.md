# Guía de Action Handlers en BaseDataComponent

## Problema Original

El `BaseDataComponent` tenía un diseño rígido donde el método `handleBtnAction` evaluaba directamente los tipos de acciones específicas, violando principios SOLID.

## Nueva Solución: Sistema de Acciones Base + Handlers Personalizados

### Arquitectura del Sistema

El nuevo sistema funciona en **3 niveles de precedencia**:

1. **Handlers Personalizados** (Prioridad Alta)
2. **Acciones Base** (Prioridad Media) 
3. **Warning/No Action** (Prioridad Baja)

### Acciones Base Disponibles

```typescript
export class BaseDataComponent {
  public static readonly BASE_ACTIONS = {
    EDIT: 'edit',      // ✅ Navegación a formulario de edición
    CREATE: 'create',  // ✅ Navegación a formulario de creación
    VIEW: 'view'       // ⚠️  Por implementar (override recomendado)
  } as const;
}
```

### Flujo de Decisión

```typescript
protected handleBtnAction(ev: { event: string, element: T }): void {
  // 1. ¿Hay handler personalizado?
  const customHandler = this.actionHandlers?.get(ev.event);
  if (customHandler) {
    customHandler(ev.element); // ✅ Ejecutar personalizado
    return;
  }

  // 2. ¿Es una acción base que podemos manejar?
  if (this.enableDefaultActions && this.canHandleBaseAction(ev.event)) {
    this.handleBaseAction(ev.event, ev.element); // ✅ Ejecutar acción base
    return;
  }

  // 3. No hay handler disponible
  console.warn(`No handler found for action: ${ev.event}`); // ⚠️ Warning
}
```

## Casos de Uso

### 1. Uso Básico (Sin configuración adicional)

```html
<!-- ✅ Funciona automáticamente con acciones base -->
<app-base-data
    [pageConfig]="pageConfig"
    [service]="service"
    [headers]="headers"
    [tableConfig]="getTableConfig()"
    [dataForms]="getForms()"
    [initFilter$]="getInitFilter()">
</app-base-data>
```

**Acciones automáticas disponibles:**
- `edit` → Navegación a formulario de edición ✅
- `create` → Navegación a formulario de creación ✅  
- `view` → Acción básica (override recomendado) ⚠️

### 2. Personalización Completa

```typescript
export class BranchesComponent {
  protected actionHandlers: Map<string, (element: BranchModel) => void>;

  constructor() {
    this.initActionHandlers();
  }

  private initActionHandlers(): void {
    this.actionHandlers = new Map();
    
    // ✅ Sobrescribir acción base
    this.actionHandlers.set('edit', (branch: BranchModel) => {
      console.log('Custom edit logic for:', branch.name);
      // Lógica personalizada, luego podría llamar al método base si quiere
    });

    // ✅ Sobrescribir view con comportamiento específico
    this.actionHandlers.set('view', (branch: BranchModel) => {
      this.router.navigate(['/branch-details', branch.id]);
    });

    // ✅ Acciones completamente nuevas
    this.actionHandlers.set('clone', (branch: BranchModel) => {
      this.service.create({ ...branch, name: `${branch.name} - Copy`, id: undefined })
        .subscribe();
    });

    this.actionHandlers.set('export', (branch: BranchModel) => {
      this.exportService.exportBranch(branch).subscribe();
    });
  }
}
```

### 3. Control de Acciones Base

```html
<!-- ✅ Deshabilitar acciones base, solo usar handlers personalizados -->
<app-base-data
    [enableDefaultActions]="false"
    [actionHandlers]="actionHandlers"
    ...>
</app-base-data>
```

### 4. Uso Híbrido

```typescript
private initActionHandlers(): void {
  this.actionHandlers = new Map();
  
  // ✅ 'edit' y 'create' usan las acciones base automáticamente
  // ✅ Solo personalizar acciones específicas
  this.actionHandlers.set('delete', (item) => {
    if (confirm('¿Eliminar?')) {
      this.service.delete(item.id).subscribe();
    }
  });
  
  this.actionHandlers.set('activate', (item) => {
    this.service.modify({ ...item, active: true }).subscribe();
  });
}
```

## Beneficios del Nuevo Diseño

### ✅ **Desacoplamiento Total**
- `BaseDataComponent` no conoce acciones específicas de features
- Las acciones base son genéricas y reutilizables
- Cada feature define solo sus acciones específicas

### ✅ **Configuración Flexible**
```typescript
// Nivel 1: Sin configuración (usa acciones base)
// <app-base-data ...> ← edit/create funcionan automáticamente

// Nivel 2: Control de acciones base
// [enableDefaultActions]="false" ← Solo handlers personalizados

// Nivel 3: Híbrido
// actionHandlers solo para acciones específicas
```

### ✅ **Escalabilidad**
- Agregar nuevas acciones base sin romper features existentes
- Features pueden sobrescribir o extender comportamientos
- Fácil testing y mantenimiento

### ✅ **Reutilización**
```typescript
// Estas acciones funcionan en CUALQUIER feature automáticamente:
BaseDataComponent.BASE_ACTIONS.EDIT   // ← Formulario de edición
BaseDataComponent.BASE_ACTIONS.CREATE // ← Formulario de creación
BaseDataComponent.BASE_ACTIONS.VIEW   // ← Acción base (customizable)
```

## Comparación: Antes vs Ahora

| Aspecto | ❌ Antes | ✅ Ahora |
|---------|----------|----------|
| **Acoplamiento** | Hard-coded 'edit' | Acciones base genéricas |
| **Extensibilidad** | Modificar BaseDataComponent | Solo agregar handlers |
| **Flexibilidad** | Una sola forma | 3 niveles de configuración |
| **Reutilización** | Limitada | Total |
| **Principios SOLID** | Violados | Respetados |

## Migración

### Para Features Existentes
```typescript
// ✅ No cambios necesarios - sigue funcionando
<app-base-data ...> ← edit funciona automáticamente
```

### Para Nuevos Features  
```typescript
// ✅ Máxima flexibilidad
[actionHandlers]="customHandlers"
[enableDefaultActions]="true|false"
```

### Para Acciones Personalizadas
```typescript
// ✅ Solo definir lo que necesitas personalizar
this.actionHandlers.set('custom-action', (item) => { ... });
// edit/create siguen funcionando automáticamente
```
