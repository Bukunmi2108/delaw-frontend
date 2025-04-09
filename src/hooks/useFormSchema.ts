import { useState, useEffect, useCallback } from 'react';

// Define types for the field schema received from the backend
interface BackendFieldSchema {
  [key: string]: {
    type: string;
    label: string;
    required?: boolean;
    description?: string;
    item_schema?: BackendFieldSchemaItem;
  };
}

interface BackendFieldSchemaItem {
  type: 'object';
  properties: {
    [key: string]: Omit<BackendFieldSchema[string], 'item_schema'>;
  };
}

// Define the TypeScript interface for the form values
type FormInterface<T extends BackendFieldSchema> = {
  [K in keyof T]: T[K]['type'] extends 'string' ? string :
                   T[K]['type'] extends 'number' ? number | undefined :
                   T[K]['type'] extends 'boolean' ? boolean | undefined :
                   T[K]['type'] extends 'date' ? Date | undefined :
                   T[K]['type'] extends 'array' ? FormInterface<NonNullable<T[K]['item_schema']>['properties']>[] :
                   any;
};

interface UseFormSchemaResult<T extends BackendFieldSchema> {
  formInterface: FormInterface<T>;
  initialValues: FormInterface<T>;
}

function useFormSchema<T extends BackendFieldSchema>(
  fieldSchema: T
): UseFormSchemaResult<T> {
  const [formInterface, setFormInterface] = useState<FormInterface<T>>({} as FormInterface<T>);
  const [initialValues, setInitialValues] = useState<FormInterface<T>>({} as FormInterface<T>);

  const createFormInterfaceAndInitialValues = useCallback(
    (schema: BackendFieldSchema) => {
      const interfaceDefinition: Record<string, string> = {};
      const initialValuesDefinition: Record<string, any> = {};

      for (const key in schema) {
        const field = schema[key];

        switch (field.type) {
          case 'string':
            interfaceDefinition[key] = 'string';
            initialValuesDefinition[key] = '';
            break;
          case 'number':
            interfaceDefinition[key] = 'number | undefined';
            initialValuesDefinition[key] = undefined;
            break;
          case 'boolean':
            interfaceDefinition[key] = 'boolean | undefined';
            initialValuesDefinition[key] = undefined;
            break;
          case 'date':
            interfaceDefinition[key] = 'Date | undefined';
            initialValuesDefinition[key] = undefined;
            break;
          case 'array':
            if (field.item_schema?.properties) {
              const {
                itemInterface,
                itemInitialValues,
              } = createFormInterfaceAndInitialValuesForItem(field.item_schema.properties);
              interfaceDefinition[key] = `(${itemInterface})[]`;
              initialValuesDefinition[key] = itemInitialValues;
            } else {
              console.warn(`Array field "${key}" has no item schema defined.`);
              interfaceDefinition[key] = 'any[]';
              initialValuesDefinition[key] = [];
            }
            break;
          default:
            interfaceDefinition[key] = 'any';
            initialValuesDefinition[key] = undefined;
            break;
        }
      }

      return {
        formInterface: interfaceDefinition as FormInterface<T>,
        initialValues: initialValuesDefinition as FormInterface<T>,
      };
    },
    []
  );

  const createFormInterfaceAndInitialValuesForItem = useCallback(
    (itemProperties: NonNullable<BackendFieldSchemaItem>['properties']): {
      itemInterface: string;
      itemInitialValues: any[];
    } => {
      const itemInterfaceDefinition: Record<string, string> = {};
      const itemInitialValuesDefinition: Record<string, any> = {};
      for (const key in itemProperties) {
        const field = itemProperties[key];
        switch (field.type) {
          case 'string':
            itemInterfaceDefinition[key] = 'string';
            itemInitialValuesDefinition[key] = '';
            break;
          case 'number':
            itemInterfaceDefinition[key] = 'number | undefined';
            itemInitialValuesDefinition[key] = undefined;
            break;
          case 'boolean':
            itemInterfaceDefinition[key] = 'boolean | undefined';
            itemInitialValuesDefinition[key] = undefined;
            break;
          case 'date':
            itemInterfaceDefinition[key] = 'Date | undefined';
            itemInitialValuesDefinition[key] = undefined;
            break;
          default:
            itemInterfaceDefinition[key] = 'any';
            itemInitialValuesDefinition[key] = undefined;
            break;
        }
      }
      return {
        itemInterface: `{ ${Object.entries(itemInterfaceDefinition)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ')} }`,
        itemInitialValues: [], // Initialize array items as empty array
      };
    },
    []
  );

  useEffect(() => {
    if (fieldSchema) {
      const {
        formInterface: iface,
        initialValues: initialVals,
      } = createFormInterfaceAndInitialValues(fieldSchema);
      setFormInterface(iface);
      setInitialValues(initialVals);
    } else {
      setFormInterface({} as FormInterface<T>);
      setInitialValues({} as FormInterface<T>);
    }
  }, [fieldSchema, createFormInterfaceAndInitialValues]);

  return { formInterface, initialValues };
}

export type { BackendFieldSchema as FieldSchema, FormInterface as FormValues };
export default useFormSchema;