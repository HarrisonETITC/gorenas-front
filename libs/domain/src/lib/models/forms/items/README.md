# Form Items Architecture

Esta arquitectura de formularios está diseñada para ser completamente independiente y no depender de archivos externos de opciones o modelos legacy.

## Estructura

### Base Classes
- `BaseFormItemPort<T>`: Interfaz abstracta que define la estructura base
- `BaseFormItemAdapter<T>`: Implementación base con validaciones comunes

### Form Item Types
- `TextFormItem`: Para campos de texto, password y número
- `SelectFormItem`: Para campos de selección con opciones estáticas
- `AutoCompleteFormItem`: Para campos de autocompletado con endpoints dinámicos

### Factory Pattern
- `FormItemFactory`: Proporciona métodos estáticos para crear form items de manera consistente
- Interfaces de configuración tipadas para cada tipo de item

### Types & Utilities
- `FormItem`: Union type de todos los form items disponibles
- Type guards para verificación de tipos en runtime
- Utilities para obtener información de tipos

## Uso

### Crear form items usando Factory

```typescript
// Campo de texto simple
const nameField = FormItemFactory.createSimpleTextField('name', 'Nombre', true);

// Campo de número
const ageField = FormItemFactory.createSimpleNumberField('age', 'Edad');

// Campo select con opciones
const statusField = FormItemFactory.createSelectItem({
    name: 'status',
    label: 'Estado',
    options: [
        new ViewValue('active', 'Activo'),
        new ViewValue('inactive', 'Inactivo')
    ]
});

// Campo autocomplete
const cityField = FormItemFactory.createAutoCompleteItem({
    name: 'city',
    label: 'Ciudad',
    endpoint: cityEndpoint
});
```

### Usar en FormDataConfig

```typescript
const formConfig = new FormDataConfig();
formConfig.title = 'Mi Formulario';
formConfig.buttonTitle = 'Guardar';
formConfig.fields = [nameField, ageField, statusField, cityField];
```

## Beneficios

1. **Independencia**: No depende de archivos de opciones externos
2. **Type Safety**: Tipado fuerte con TypeScript
3. **Consistencia**: Factory pattern asegura creación uniforme
4. **Flexibilidad**: Fácil de extender con nuevos tipos
5. **Mantenibilidad**: Código organizado y bien estructurado
