"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { DestinationDetail } from "@/lib/destinations";

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

type FormErrors = Partial<Record<FormKey, string>>;

/**
 * The destination prop carries numbers (price, rating) and extra fields
 * (highlights, reviewCount…). The form only edits the seven string fields,
 * so coerce everything up front — otherwise `form.price.trim()` throws.
 */
function toFormState(destination: DestinationDetail): FormState {
  return {
    name: destination.name,
    country: destination.country,
    price: String(destination.price),
    duration: destination.duration,
    date: destination.date,
    imageUrl: destination.imageUrl,
    description: destination.description,
  };
}

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




const EditDestination = ({ destination }: { destination: DestinationDetail }) => {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(() => toFormState(destination));
  const [category, setCategory] = useState("beach");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const update =
    (key: FormKey) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
        setSubmitted(false);
        setSaveError(null);
      };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaveError(null);
    try {
      const res = await fetch(`http://localhost:8000/all-destination/${destination.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`PATCH failed with status ${res.status}`);
      const data = await res.json();
      console.log('Response from server:', data);
      setSubmitted(true);
      // Re-fetch the server component so the page behind the dialog shows the new data.
      router.refresh();
      redirect(`/all-destinations/${destination.id}`);
    } catch {
      setSaveError("Couldn't save your changes. Please try again.");
    }
  };

  const reset = () => {
    setForm(toFormState(destination));
    setCategory("beach");
    setErrors({});
    setSubmitted(false);
    setSaveError(null);
  };


  return (
    <Dialog>
      {/* Render the trigger *as* the Button — a <button> inside DialogTrigger's
          own <button> is invalid HTML and breaks hydration. */}
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-lg border-[#e4e4e7] bg-white px-4 text-sm font-medium text-[#121212] hover:bg-[#f5f5f5] hover:text-[#121212]"
          />
        }
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit
      </DialogTrigger>
      <DialogContent className='min-w-xl p-10'>
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
          <DialogDescription>
            Update the travel package details below and save your changes.
          </DialogDescription>
        </DialogHeader>
        {/* The form must be a sibling of DialogDescription — that element
            renders a <p>, which cannot contain a <form> or <div>. */}
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

          {saveError && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {saveError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={reset}>
              Reset
            </Button>
            <Button
              type="button"
              render={<Link href="/" />}
              nativeButton={false}
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
              {submitted ? "Changes Saved" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestination;
