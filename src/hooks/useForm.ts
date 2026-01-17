import { useState, useCallback, ChangeEvent } from 'react';

export function useForm<T extends Record<string, string>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return { values, handleChange, resetForm, setValue, setValues };
}
