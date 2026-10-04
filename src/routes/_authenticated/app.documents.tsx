import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileCheck2, FileClock, FileUp, FileWarning, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { applicationsQuery, DOC_KINDS, documentsQuery, getUserId } from "@/lib/app-data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: docs = [], isLoading } = useQuery(documentsQuery);
  const { data: applications = [] } = useQuery(applicationsQuery);
  const [kind, setKind] = useState(DOC_KINDS[0] ?? "Other");
  const [applicationId, setApplicationId] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Choose a file smaller than 10 MB.");
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Upload a PDF, JPG or PNG file.");
      return;
    }
    setUploading(true);
    let storagePath = "";
    try {
      const user_id = await getUserId();
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      storagePath = `${user_id}/${crypto.randomUUID()}-${cleanName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("documents").insert({
        user_id,
        application_id: applicationId || null,
        kind,
        file_name: file.name,
        storage_path: storagePath,
        status: "uploaded",
      });
      if (insertError) {
        await supabase.storage.from("documents").remove([storagePath]);
        throw insertError;
      }
      if (inputRef.current) inputRef.current.value = "";
      await qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded securely.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The upload could not be completed.");
    } finally {
      setUploading(false);
    }
  }

  async function download(path: string) {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function remove(id: string, path: string) {
    try {
      const { error: fileError } = await supabase.storage.from("documents").remove([path]);
      if (fileError) throw fileError;
      const { error: rowError } = await supabase.from("documents").delete().eq("id", id);
      if (rowError) throw rowError;
      await qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Document could not be removed.");
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Document centre</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        One secure checklist for every application
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Files are stored privately and can only be accessed by you and authorised Livio reviewers.
      </p>

      <section className="mt-6 rounded-[2rem] bg-card p-5 ring-1 ring-border sm:p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-primary/10 p-3 text-primary">
            <FileUp />
          </span>
          <div>
            <h2 className="font-semibold">Upload a document</h2>
            <p className="text-xs text-muted-foreground">PDF, JPG or PNG · maximum 10 MB</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            aria-label="Document type"
            className="h-11 rounded-full border border-input bg-background px-4 text-sm"
          >
            {DOC_KINDS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
            aria-label="Related application"
            className="h-11 rounded-full border border-input bg-background px-4 text-sm"
          >
            <option value="">General document</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {(application.universities as { name?: string } | null)?.name ?? "University"} —{" "}
                {application.program}
              </option>
            ))}
          </select>
          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) => upload(event.target.files?.[0])}
            />
            <Button
              type="button"
              className="h-11 w-full rounded-full lg:w-auto"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Choose file"}
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <p className="mt-6">Loading…</p>
      ) : docs.length === 0 ? (
        <div className="mt-6 rounded-[2rem] bg-card p-8 text-center ring-1 ring-border">
          <FileClock className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">No documents uploaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a general document or connect it to an application.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {docs.map((document) => (
            <article
              key={document.id}
              className="flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border sm:flex-row sm:items-center"
            >
              {document.status === "approved" ? (
                <FileCheck2 className="shrink-0 text-emerald-600" />
              ) : document.status === "needs_changes" ? (
                <FileWarning className="shrink-0 text-amber-600" />
              ) : (
                <FileClock className="shrink-0 text-primary" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{document.kind}</h2>
                <p className="truncate text-sm text-muted-foreground">
                  {document.file_name} · {document.status.replace("_", " ")}
                </p>
                {document.reviewer_note && (
                  <p className="mt-1 text-xs text-amber-700">{document.reviewer_note}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label={`Download ${document.file_name}`}
                  onClick={() => download(document.storage_path)}
                >
                  <Download />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full text-destructive"
                  aria-label={`Delete ${document.file_name}`}
                  onClick={() => remove(document.id, document.storage_path)}
                >
                  <Trash2 />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
