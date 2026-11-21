import { useForm } from "@tanstack/react-form";
import type { ProjectInput } from "../api";
import { projectFormSchema, type ProjectFormValues } from "../schemas";

interface ProjectFormProps {
  initialValues?: ProjectFormValues;
  submitLabel: string;
  onSubmit: (data: ProjectInput) => Promise<unknown>;
}

const emptyValues: ProjectFormValues = {
  title: "",
  slug: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
};

const inputClass =
  "rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 outline-none focus:border-zinc-400";

export function ProjectForm({ initialValues = emptyValues, submitLabel, onSubmit }: ProjectFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: projectFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        technologies: value.technologies.split(",").map(t => t.trim()).filter(Boolean),
        liveUrl: value.liveUrl === "" ? undefined : value.liveUrl,
      });
    },
  });

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex max-w-xl flex-col gap-5"
    >
      <form.Field name="title">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            Naslov
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="slug">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            Slug (deo adrese)
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="moj-projekat"
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="description">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            Opis
            <textarea
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={4}
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="technologies">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            Tehnologije (odvojene zarezom)
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="TypeScript, React, Node.js"
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="githubUrl">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            GitHub link
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="https://github.com/Vasic11/..."
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="liveUrl">
        {field => (
          <label className="flex flex-col gap-2 text-sm text-zinc-400">
            Demo link (opciono)
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={inputClass}
            />
            <FieldError meta={field.state.meta} />
          </label>
        )}
      </form.Field>

      <form.Field name="featured">
        {field => (
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={e => field.handleChange(e.target.checked)}
              className="size-4"
            />
            Istaknut na početnoj
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-fit rounded-lg bg-white px-5 py-2 font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
          >
            {isSubmitting ? "Čuvanje..." : submitLabel}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}

interface FieldErrorProps {
  meta: { isTouched: boolean; errors: ({ message?: string } | undefined)[] };
}

function FieldError({ meta }: FieldErrorProps) {
  if (!meta.isTouched || meta.errors.length === 0) return null;
  return <span className="text-red-400">{meta.errors.map(e => e?.message).join(", ")}</span>;
}
