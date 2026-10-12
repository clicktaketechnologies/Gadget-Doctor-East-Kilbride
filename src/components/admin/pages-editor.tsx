"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  FileEdit,
  Check,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { usePageContent, useSavePageContent } from "@/lib/api-hooks";
import type { PageContentMap, UpdatePageContentInput } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type FieldType = "input" | "textarea";

interface PageField {
  section: string;
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

interface PageDef {
  key: string;
  label: string;
  fields: PageField[];
}

const PAGES: PageDef[] = [
  {
    key: "home",
    label: "Home",
    fields: [
      {
        section: "hero",
        key: "headline",
        label: "Hero headline",
        type: "input",
        placeholder: "Gadget Doctor East Kilbride",
      },
      {
        section: "hero",
        key: "subtitle",
        label: "Hero subtitle",
        type: "textarea",
        placeholder: "Trusted phone, tablet & laptop repair in East Kilbride.",
      },
      {
        section: "why-choose",
        key: "title",
        label: "Why Choose Us — title",
        type: "input",
        placeholder: "Why East Kilbride chooses us",
      },
      {
        section: "cta-band",
        key: "heading",
        label: "CTA band — heading",
        type: "input",
        placeholder: "Ready to get your device fixed?",
      },
      {
        section: "cta-band",
        key: "subheading",
        label: "CTA band — subheading",
        type: "textarea",
        placeholder: "Book online in 60 seconds or call us today.",
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    fields: [
      {
        section: "page",
        key: "heading",
        label: "Page heading",
        type: "input",
        placeholder: "Our Repair Services",
      },
      {
        section: "page",
        key: "subtitle",
        label: "Page subtitle",
        type: "textarea",
        placeholder: "Choose from 38 repair services across 8 categories.",
      },
    ],
  },
  {
    key: "collection",
    label: "Collection",
    fields: [
      {
        section: "page",
        key: "heading",
        label: "Page heading",
        type: "input",
        placeholder: "Doorstep Collection Service",
      },
      {
        section: "page",
        key: "subtitle",
        label: "Page subtitle",
        type: "textarea",
        placeholder: "We come to you — pickup and return across East Kilbride.",
      },
      {
        section: "steps",
        key: "intro",
        label: "Process steps — intro",
        type: "textarea",
        placeholder: "Here's how our doorstep collection works.",
      },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    fields: [
      {
        section: "page",
        key: "heading",
        label: "Page heading",
        type: "input",
        placeholder: "Customer Reviews",
      },
      {
        section: "page",
        key: "subtitle",
        label: "Page subtitle",
        type: "textarea",
        placeholder: "Real reviews from happy customers across East Kilbride.",
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    fields: [
      {
        section: "page",
        key: "heading",
        label: "Page heading",
        type: "input",
        placeholder: "Get in Touch",
      },
      {
        section: "page",
        key: "subtitle",
        label: "Page subtitle",
        type: "textarea",
        placeholder: "Visit our workshop or call us today.",
      },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    fields: [
      {
        section: "page",
        key: "heading",
        label: "Page heading",
        type: "input",
        placeholder: "Tech Tips & News",
      },
      {
        section: "page",
        key: "subtitle",
        label: "Page subtitle",
        type: "textarea",
        placeholder: "Latest articles and repair tips from our workshop.",
      },
    ],
  },
];

function getInitialValues(
  data: PageContentMap | undefined,
  pageKey: string,
  fields: PageField[]
): Record<string, string> {
  const map = data?.[pageKey] ?? {};
  const out: Record<string, string> = {};
  for (const f of fields) {
    out[`${f.section}.${f.key}`] = map?.[f.section]?.[f.key] ?? "";
  }
  return out;
}

export function PagesEditor() {
  const pagesQ = usePageContent();
  const [activePage, setActivePage] = useState<string>("home");

  if (pagesQ.isLoading || !pagesQ.data) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-10 w-full max-w-md rounded" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Page Content</h2>
        <p className="text-sm text-muted-foreground">
          Edit the text and headings shown on each public page. Changes override
          the defaults site-wide.
        </p>
      </div>

      <Tabs value={activePage} onValueChange={setActivePage}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1">
          {PAGES.map((p) => (
            <TabsTrigger key={p.key} value={p.key} className="flex-1 min-w-[80px]">
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map((p) => (
          <TabsContent key={p.key} value={p.key} className="mt-4">
            <PageForm
              key={p.key}
              pageKey={p.key}
              pageLabel={p.label}
              fields={p.fields}
              initialData={getInitialValues(pagesQ.data, p.key, p.fields)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function PageForm({
  pageKey,
  pageLabel,
  fields,
  initialData,
}: {
  pageKey: string;
  pageLabel: string;
  fields: PageField[];
  initialData: Record<string, string>;
}) {
  const saveMutation = useSavePageContent();
  const [values, setValues] = useState<Record<string, string>>(initialData);

  // Group fields by section for display
  const sections = fields.reduce<
    { section: string; label: string; fields: PageField[] }[]
  >((acc, f) => {
    const existing = acc.find((s) => s.section === f.section);
    if (existing) {
      existing.fields.push(f);
    } else {
      acc.push({
        section: f.section,
        label: sectionLabel(f.section),
        fields: [f],
      });
    }
    return acc;
  }, []);

  const dirty = fields.some(
    (f) => values[`${f.section}.${f.key}`] !== (initialData[`${f.section}.${f.key}`] ?? "")
  );

  const handleSave = () => {
    const payload: UpdatePageContentInput[] = fields.map((f) => ({
      page: pageKey,
      section: f.section,
      key: f.key,
      value: values[`${f.section}.${f.key}`] ?? "",
    }));
    saveMutation.mutate(payload);
  };

  const handleReset = () => {
    setValues(initialData);
  };

  return (
    <Card className="glass flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <FileEdit className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {pageLabel} page
            </h3>
            <p className="text-xs text-muted-foreground">
              {fields.length} editable field{fields.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-secondary/40 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          page: <span className="font-mono text-foreground">{pageKey}</span>
        </span>
      </div>

      <p className="rounded-md border border-border/60 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground">
        Edits here override the default text on the public site. Leave a field
        blank to use the default.
      </p>

      <div className="space-y-5">
        {sections.map((sec) => (
          <div key={sec.section} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {sec.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                [{sec.section}]
              </span>
            </div>
            <div className="space-y-3">
              {sec.fields.map((f) => {
                const fieldKey = `${f.section}.${f.key}`;
                const isDirty = values[fieldKey] !== (initialData[fieldKey] ?? "");
                return (
                  <div key={fieldKey} className="space-y-1.5">
                    <Label
                      htmlFor={`pf-${fieldKey}`}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {f.label}
                      {isDirty && (
                        <span className="size-1.5 rounded-full bg-amber-400" aria-hidden />
                      )}
                    </Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        id={`pf-${fieldKey}`}
                        rows={2}
                        placeholder={f.placeholder}
                        value={values[fieldKey] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [fieldKey]: e.target.value }))
                        }
                      />
                    ) : (
                      <Input
                        id={`pf-${fieldKey}`}
                        placeholder={f.placeholder}
                        value={values[fieldKey] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [fieldKey]: e.target.value }))
                        }
                      />
                    )}
                    <div className="font-mono text-[10px] text-muted-foreground">
                      key: <span className="text-foreground/70">{f.key}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {saveMutation.isError && (
        <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{saveMutation.error?.message ?? "Save failed"}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
        <Button
          onClick={handleSave}
          disabled={!dirty || saveMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : saveMutation.isSuccess && !dirty ? (
            <>
              <Check className="size-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!dirty || saveMutation.isPending}
          className="gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
        {dirty && (
          <span className="text-xs text-amber-300">
            Unsaved changes
          </span>
        )}
      </div>
    </Card>
  );
}

function sectionLabel(section: string): string {
  // Human-readable labels for known sections
  const labels: Record<string, string> = {
    hero: "Hero",
    "why-choose": "Why Choose Us",
    "cta-band": "Call-to-action Band",
    page: "Page Header",
    steps: "Process Steps",
  };
  return labels[section] ?? section;
}

export default PagesEditor;
