"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = {
  beach: "Beach",
  mountain: "Mountain",
  city: "City",
  adventure: "Adventure",
  cultural: "Cultural",
};

const fieldClassName = "h-9 rounded-md border-transparent bg-muted px-3";

type FormKey =
  | "name"
  | "country"
  | "price"
  | "duration"
  | "date"
  | "imageUrl"
  | "description";

type FormState = Record<FormKey, string>;

const initialForm: FormState = {
  name: "",
  country: "",
  price: "",
  duration: "",
  date: "",
  imageUrl: "",
  description: "",
};

type FormErrors = Partial<Record<FormKey, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Destination name is required";
  if (!form.country.trim()) errors.country = "Country is required";
  if (!form.price.trim()) {
    errors.price = "Price is required";
  } else if (Number(form.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }
  if (!form.duration.trim()) errors.duration = "Duration is required";
  if (form.imageUrl.trim() && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(form.imageUrl.trim())) {
    errors.imageUrl = "Enter a valid URL (https://…)";
  }
  if (!form.description.trim()) errors.description = "Description is required";

  return errors;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <FieldError errors={[{ message: error }]} />}
    </div>
  );
}

export default function AddDestinationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [category, setCategory] = useState("beach");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update =
    (key: FormKey) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
      };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const res = await fetch('http://localhost:8000/add-destination', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log('Response from server:', data);
    if (res.ok) {
      setSubmitted(true);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setCategory("beach");
    setErrors({});
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-12">
      <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-foreground">
        Add New Travel Package
      </h1>

      {submitted ? (
        <Card className="mx-auto mt-10 max-w-xl p-7 shadow-sm ring-border">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-brand" aria-hidden="true" />
            <h2 className="text-xl font-medium text-foreground">
              Travel Package Added!
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Your travel package has been successfully created and is ready to
              be discovered by travelers.
            </p>
            <Button
              type="button"
              onClick={reset}
              className="mt-3 h-9 gap-2 bg-brand px-4 text-white hover:bg-brand/90"
            >
              Add Another Package
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="mx-auto mt-10 max-w-xl p-7 shadow-sm ring-border">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col">
            <div className="flex flex-col gap-4">
              <Field id="destination-name" label="Destination Name" error={errors.name}>
                <Input
                  id="destination-name"
                  placeholder="Bali Paradise"
                  value={form.name}
                  onChange={update("name")}
                  aria-invalid={errors.name ? true : undefined}
                  className={fieldClassName}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field id="country" label="Country" error={errors.country}>
                  <Input
                    id="country"
                    placeholder="Indonesia"
                    value={form.country}
                    onChange={update("country")}
                    aria-invalid={errors.country ? true : undefined}
                    className={fieldClassName}
                  />
                </Field>
                <Field id="category" label="Category">
                  <Select
                    items={categories}
                    value={category}
                    onValueChange={(value) => {
                      if (value != null) setCategory(String(value));
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-9 w-full rounded-md border-transparent bg-muted px-3"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field id="price" label="Price (USD)" error={errors.price}>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    placeholder="e.g., 1299"
                    value={form.price}
                    onChange={update("price")}
                    aria-invalid={errors.price ? true : undefined}
                    className={fieldClassName}
                  />
                </Field>
                <Field id="duration" label="Duration" error={errors.duration}>
                  <Input
                    id="duration"
                    placeholder="e.g., 7 Days/6 Nights"
                    value={form.duration}
                    onChange={update("duration")}
                    aria-invalid={errors.duration ? true : undefined}
                    className={fieldClassName}
                  />
                </Field>
              </div>

              <Field id="departure-date" label="Departure Date">
                <Input
                  id="departure-date"
                  type="date"
                  value={form.date}
                  onChange={update("date")}
                  className={fieldClassName}
                />
              </Field>

              <Field id="image-url" label="Image URL" error={errors.imageUrl}>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={update("imageUrl")}
                  aria-invalid={errors.imageUrl ? true : undefined}
                  className={fieldClassName}
                />
              </Field>

              <Field
                id="description"
                label="Description"
                error={errors.description}
              >
                <Textarea
                  id="description"
                  placeholder="Describe the travel experience..."
                  value={form.description}
                  onChange={update("description")}
                  aria-invalid={errors.description ? true : undefined}
                  className="min-h-28 rounded-md border-transparent bg-muted px-3 py-2"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                render={<Link href="/" />}
                variant="outline"
                className="h-9 gap-2 border-destructive/30 bg-white px-4 text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 gap-2 bg-brand px-4 text-white hover:bg-brand/90"
              >
                <Save className="size-4" />
                Add Travel Package
              </Button>
            </div>
          </form>
        </Card>
      )}
    </main>
  );
}
