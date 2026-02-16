"use client";

import { useState } from "react";
import { Upload, FileText, X, Check } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      type: f.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = selectedFiles.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PlatformLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Importer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez de nouveaux documents à votre archive
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`rounded border-2 border-dashed p-6 md:p-10 text-center transition-colors ${
              isDragging ? "border-foreground" : "border-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload
              className="mx-auto h-10 w-10 text-muted-foreground/50"
              strokeWidth={1}
            />
            <p className="mt-3 text-sm text-foreground font-medium">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ou cliquez pour sélectionner — PDF, DOCX, PPTX, XLSX (max 50 MB)
            </p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.docx,.pptx,.xlsx,.doc,.xls,.ppt"
              />
              Parcourir les fichiers
            </label>
          </div>

          {files.length > 0 && (
            <div className="border border-border rounded">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Fichiers sélectionnés ({files.length})
                </h2>
              </div>
              <div className="divide-y divide-border">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
                        <FileText
                          className="h-4 w-4 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.type} — {file.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-border rounded p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Métadonnées
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Rapport annuel 2025"
                  className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-8 w-full rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground"
                >
                  <option value="">Sélectionner</option>
                  <option value="Rapports">Rapports</option>
                  <option value="Contrats">Contrats</option>
                  <option value="Factures">Factures</option>
                  <option value="Juridique">Juridique</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="finance, annuel"
                  className="h-8 w-full rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optionnel"
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground resize-none"
                />
              </div>
            </div>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2 rounded bg-foreground px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40"
            disabled={files.length === 0}
          >
            <Check className="h-4 w-4" strokeWidth={1.5} />
            Archiver {files.length > 0 ? `(${files.length} fichier${files.length > 1 ? "s" : ""})` : ""}
          </button>
        </div>
      </div>
    </div>
    </PlatformLayout>
  );
}
