import { useCallback, useState } from 'react';

type FormFields = {
  [key: string]: string;
};

export const useForm = (initialValues: FormFields = {}) => {
  const [formFields, setFormFields] = useState<FormFields>(initialValues);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetFields = useCallback(() => {
    setFormFields(initialValues);
  }, [initialValues]);

  return {
    formFields,
    handleChange,
    resetFields,
  };
};
