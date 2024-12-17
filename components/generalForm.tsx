import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Field definition
export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "password" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[]; // For select fields
};

interface GeneralFormProps<T> {
  title: string;
  description?: string;
  fields: Field[];
  schema: ZodSchema<T>; // Zod schema for validation
  initialData?: T;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

const GeneralForm = <T,>({
  title,
  description,
  fields,
  schema,
  initialData,
  onSubmit,
  onCancel,
  submitButtonText = "Save",
}: GeneralFormProps<T>) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const renderInput = (field: Field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "password":
      case "date":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name as any)}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            {...register(field.name as any)}
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => setValue(field.name as any, value)}
            defaultValue={initialData?.[field.name] as any}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-gray-500 mb-4">{description}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium">{field.label}</label>
            {renderInput(field)}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralForm;
