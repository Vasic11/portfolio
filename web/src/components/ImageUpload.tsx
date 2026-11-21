import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: url => onChange(url),
  });

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className="flex items-start gap-4">
          <img src={value} alt="" className="aspect-video w-60 rounded-lg border border-zinc-800 object-cover" />
          <button type="button" onClick={() => onChange("")} className="text-zinc-500 hover:text-red-400">
            Ukloni
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) uploadMutation.mutate(file);
          event.target.value = "";
        }}
        className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-zinc-200 hover:file:bg-zinc-700"
      />

      {uploadMutation.isPending && <span className="text-zinc-500">Otpremanje...</span>}
      {uploadMutation.error && <span className="text-red-400">{uploadMutation.error.message}</span>}
    </div>
  );
}
