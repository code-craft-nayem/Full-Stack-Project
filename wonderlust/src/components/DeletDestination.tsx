'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



const DeletDestination = ({ id }: { id: string }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    // Guard against double-clicks — a second DELETE would just report
    // deletedCount: 0 and look like a failure.
    if (deleting) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/all-destination/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`DELETE failed with status ${res.status}`);
      const data = await res.json();
      console.log(data);

      // The detail page for a deleted destination must go — refreshing it
      // would fall back to seed data, so navigate to the list instead.
      router.push("/all-destinations");
    } catch {
      // AlertDialogAction is a plain button (not a Close), so the dialog is
      // still open and can show the failure inline.
      setError("Couldn't delete this destination. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            className="h-10 gap-2 rounded-lg border-destructive/30 bg-white px-4 text-sm font-medium text-destructive hover:bg-destructive/5 hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            destination.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletDestination;
