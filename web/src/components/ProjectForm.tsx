import type { ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { translateToEnglish, type ProjectInput } from "../api";
import { ImageUpload } from "./ImageUpload";
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
  imageUrl: "",
  problem: "",
  role: "",
  lessons: "",
  descriptionEn: "",
  problemEn: "",
  roleEn: "",
  lessonsEn: "",
  featured: false,
};

// Polja koja se crtaju isto (labela, opis, input ili textarea), pa ih opisujemo nizom umesto da ih ponavljamo.
const basicFields = [
  { name: "description", label: "Opis", hint: "Dve-tri rečenice: šta projekat radi. Vidi se na kartici i na vrhu stranice.", rows: 3 },
  { name: "technologies", label: "Tehnologije", hint: "Odvojene zarezom.", placeholder: "TypeScript, React, Node.js" },
  { name: "githubUrl", label: "GitHub link", placeholder: "https://github.com/Vasic11/..." },
  { name: "liveUrl", label: "Demo link (opciono)", hint: "Ako projekat radi negde na internetu.", placeholder: "https://..." },
] as const;

const caseStudyFields = [
  { name: "problem", label: "Problem", placeholder: "Šta je bio cilj, za koga je, zašto je zanimljiv?", rows: 4 },
  { name: "role", label: "Moja uloga", placeholder: "Šta si ti radio? Kod timskih projekata, koji deo je bio tvoj?", rows: 4 },
  { name: "lessons", label: "Izazovi i šta sam naučio", placeholder: "Šta je bilo najteže i kako si to rešio?", rows: 4 },
] as const;

// Svako englesko polje zna iz kog srpskog polja se prevodi.
const englishFields = [
  { name: "descriptionEn", from: "description", label: "Description", rows: 3 },
  { name: "problemEn", from: "problem", label: "Problem", rows: 4 },
  { name: "roleEn", from: "role", label: "My role", rows: 4 },
  { name: "lessonsEn", from: "lessons", label: "Challenges and what I learned", rows: 4 },
] as const;

const inputClass =
  "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-fg placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

/** "Čvor Žurnal 2" -> "cvor-zurnal-2" */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectForm({ initialValues = emptyValues, submitLabel, onSubmit }: ProjectFormProps) {
  // Za nov projekat slug se sam pravi iz naslova. Kod postojećeg ga ne diramo, jer bi se promenila adresa.
  const autoSlug = initialValues.slug === "";

  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: projectFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        technologies: value.technologies.split(",").map(t => t.trim()).filter(Boolean),
        liveUrl: value.liveUrl === "" ? undefined : value.liveUrl,
        imageUrl: value.imageUrl === "" ? null : value.imageUrl,
        problem: value.problem.trim() || null,
        role: value.role.trim() || null,
        lessons: value.lessons.trim() || null,
        descriptionEn: value.descriptionEn.trim() || null,
        problemEn: value.problemEn.trim() || null,
        roleEn: value.roleEn.trim() || null,
        lessonsEn: value.lessonsEn.trim() || null,
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async () => {
      const values = form.state.values;
      const toTranslate = englishFields.filter(field => values[field.from].trim() !== "");
      if (toTranslate.length === 0) throw new Error("Prvo popuni srpske tekstove");

      const translations = await translateToEnglish(toTranslate.map(field => values[field.from]));
      toTranslate.forEach((field, i) => form.setFieldValue(field.name, translations[i] ?? ""));
    },
  });

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex max-w-2xl flex-col gap-6"
    >
      <FormSection title="Osnovno">
        <form.Field name="title">
          {field => (
            <FieldShell label="Naslov" hint="Ime projekta, onako kako ga posetioci vide." meta={field.state.meta}>
              <input
                value={field.state.value}
                onChange={e => {
                  field.handleChange(e.target.value);
                  if (autoSlug && !form.getFieldMeta("slug")?.isDirty) {
                    form.setFieldValue("slug", slugify(e.target.value), { dontUpdateMeta: true });
                  }
                }}
                onBlur={field.handleBlur}
                placeholder="Shell Data Pipeline"
                className={inputClass}
              />
            </FieldShell>
          )}
        </form.Field>

        <form.Field name="slug">
          {field => (
            <FieldShell
              label="Slug"
              hint={
                <>
                  Deo adrese stranice projekta: <span className="font-mono text-fg">/projects/{field.state.value || "..."}</span>.
                  Samo mala slova, brojevi i crtice.
                </>
              }
              meta={field.state.meta}
            >
              <input
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="shell-data-pipeline"
                className={`${inputClass} font-mono text-sm`}
              />
            </FieldShell>
          )}
        </form.Field>

        {basicFields.map(config => (
          <form.Field key={config.name} name={config.name}>
            {field => (
              <FieldShell label={config.label} hint={"hint" in config ? config.hint : undefined} meta={field.state.meta}>
                {"rows" in config ? (
                  <textarea
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={config.rows}
                    className={inputClass}
                  />
                ) : (
                  <input
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={config.placeholder}
                    className={inputClass}
                  />
                )}
              </FieldShell>
            )}
          </form.Field>
        ))}
      </FormSection>

      <FormSection title="Studija slučaja" description="Opciono, ali ovo recruiteri najviše čitaju. Prikazuje se kao kartice na stranici projekta.">
        {caseStudyFields.map(config => (
          <form.Field key={config.name} name={config.name}>
            {field => (
              <FieldShell label={config.label} meta={field.state.meta}>
                <textarea
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={config.rows}
                  placeholder={config.placeholder}
                  className={inputClass}
                />
              </FieldShell>
            )}
          </form.Field>
        ))}
      </FormSection>

      <FormSection
        title="English"
        description="Prazno polje znači da se na engleskoj verziji prikazuje srpski tekst. Dugme popuni polja prevodom, a ti ga pročitaj i ispravi pre čuvanja."
        action={
          <button
            type="button"
            onClick={() => translateMutation.mutate()}
            disabled={translateMutation.isPending}
            className="shrink-0 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15 disabled:opacity-60"
          >
            {translateMutation.isPending ? "Prevodim..." : "Prevedi sa srpskog"}
          </button>
        }
      >
        {translateMutation.error && <p className="text-sm text-red-500">{translateMutation.error.message}</p>}
        {englishFields.map(config => (
          <form.Field key={config.name} name={config.name}>
            {field => (
              <FieldShell label={config.label} meta={field.state.meta}>
                <textarea
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={config.rows}
                  className={inputClass}
                />
              </FieldShell>
            )}
          </form.Field>
        ))}
      </FormSection>

      <FormSection title="Slika i prikaz">
        <form.Field name="imageUrl">
          {field => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-fg">Slika projekta (opciono)</span>
              <ImageUpload value={field.state.value} onChange={field.handleChange} />
            </div>
          )}
        </form.Field>

        <form.Field name="featured">
          {field => (
            <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-fg">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={e => field.handleChange(e.target.checked)}
                className="size-4 accent-accent"
              />
              Istaknut na početnoj
            </label>
          )}
        </form.Field>
      </FormSection>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-fit rounded-lg bg-accent px-6 py-2.5 font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {isSubmitting ? "Čuvanje..." : submitLabel}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

function FormSection({ title, description, action, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-fg">{title}</h3>
          {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface FieldMeta {
  isTouched: boolean;
  errors: ({ message?: string } | undefined)[];
}

interface FieldShellProps {
  label: string;
  hint?: ReactNode | undefined;
  meta: FieldMeta;
  children: ReactNode;
}

function FieldShell({ label, hint, meta, children }: FieldShellProps) {
  const showError = meta.isTouched && meta.errors.length > 0;
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-fg">{label}</span>
      {children}
      {showError ? (
        <span className="text-xs text-red-500">{meta.errors.map(e => e?.message).join(", ")}</span>
      ) : (
        hint && <span className="text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}
