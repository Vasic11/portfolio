import { useId, useState, type DragEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: url => onChange(url),
  });

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) uploadMutation.mutate(file);
  }

  // Pravi <input type="file"> je sakriven (sr-only), ali i dalje radi i sa tastaturom.
  // Klik na <label htmlFor=...> otvara isti prozor za izbor fajla.
  const input = (
    <input
      id={inputId}
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={event => {
        const file = event.target.files?.[0];
        if (file) uploadMutation.mutate(file);
        event.target.value = "";
      }}
      className="peer sr-only"
    />
  );

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="overflow-hidden rounded-xl border border-line bg-bg">
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <div className="flex items-center justify-end gap-2 border-t border-line p-3 text-sm">
            {input}
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-fg transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:bg-card"
            >
              {uploadMutation.isPending ? "Otpremanje..." : "Zameni"}
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg px-3 py-1.5 text-muted transition-colors hover:text-red-500"
            >
              Ukloni
            </button>
          </div>
        </div>
      ) : (
        <>
          {input}
          <label
            htmlFor={inputId}
            onDragOver={event => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            data-dragging={dragging || undefined}
            className="flex aspect-[16/6] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-bg px-6 text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:border-accent/60 data-dragging:border-accent data-dragging:bg-accent/5"
          >
            <span className="grid size-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="m21 16-5-5-9 9" />
              </svg>
            </span>
            <span className="text-sm text-fg">
              {uploadMutation.isPending ? "Otpremanje..." : "Prevuci sliku ovde ili klikni da izabereš"}
            </span>
            <span className="text-xs text-muted">PNG, JPG ili WebP, najviše 4 MB. Najlepše izgleda u odnosu 16:9.</span>
          </label>
        </>
      )}

      {uploadMutation.error && <span className="text-sm text-red-500">{uploadMutation.error.message}</span>}
    </div>
  );
}
