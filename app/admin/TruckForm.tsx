"use client";

import { useState, useRef } from "react";
import { Truck, TruckStatus, TruckType } from "@/lib/types";

interface TruckFormProps {
  initial?: Truck;
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  status: "available" as TruckStatus,
  type: "wrecker" as TruckType,
  buildsheet_url: "",
  chassis: "",
  engine: "",
  boom: "",
  winch: "",
  additional_features: "",
};

export default function TruckForm({ initial, onSave, onCancel }: TruckFormProps) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    return {
      title: initial.title,
      description: initial.description,
      price: String(initial.price),
      status: initial.status,
      type: initial.type,
      buildsheet_url: initial.buildsheet_url,
      chassis: initial.specs.chassis,
      engine: initial.specs.engine,
      boom: initial.specs.boom,
      winch: initial.specs.winch,
      additional_features: initial.specs.additional_features.join("\n"),
    };
  });

  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const truckId = initial?.id ?? `nrc-${Date.now()}`;

    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            truckId,
            filename: file.name,
            base64: base64.split(",")[1], // strip data:image/... prefix
            mimeType: file.type,
          }),
        });

        if (res.ok) {
          const { url } = await res.json();
          setImages((prev) => [...prev, url]);
        }
      } catch {
        console.error("Upload failed for", file.name);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      status: form.status,
      type: form.type,
      images,
      buildsheet_url: form.buildsheet_url,
      specs: {
        chassis: form.chassis,
        engine: form.engine,
        boom: form.boom,
        winch: form.winch,
        additional_features: form.additional_features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    try {
      const url = initial ? `/api/trucks/${initial.id}` : "/api/trucks";
      const method = initial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed.");
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="2024 Kenworth T880 50-Ton Rotator"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Type *</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="form-input"
          >
            <option value="wrecker">Wrecker</option>
            <option value="rollback">Rollback</option>
            <option value="rotator">Rotator</option>
          </select>
        </div>

        <div>
          <label className="form-label">Status *</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="form-input"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div>
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0 = Call for Price"
            min="0"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Buildsheet URL (PDF)</label>
          <input
            type="url"
            value={form.buildsheet_url}
            onChange={(e) => set("buildsheet_url", e.target.value)}
            placeholder="https://..."
            className="form-input"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="form-input resize-none"
          placeholder="Detailed description of the truck..."
        />
      </div>

      {/* Specs */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#FFC700] rounded inline-block" />
          Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Chassis</label>
            <input
              type="text"
              value={form.chassis}
              onChange={(e) => set("chassis", e.target.value)}
              placeholder="Kenworth T880"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Engine</label>
            <input
              type="text"
              value={form.engine}
              onChange={(e) => set("engine", e.target.value)}
              placeholder="Paccar MX-13 565HP"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Boom</label>
            <input
              type="text"
              value={form.boom}
              onChange={(e) => set("boom", e.target.value)}
              placeholder="50-ton full-rotation boom"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Winch</label>
            <input
              type="text"
              value={form.winch}
              onChange={(e) => set("winch", e.target.value)}
              placeholder="Dual 50,000 lb planetary winches"
              className="form-input"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label">
            Additional Features{" "}
            <span className="text-[#9E9E9E] font-normal">(one per line)</span>
          </label>
          <textarea
            value={form.additional_features}
            onChange={(e) => set("additional_features", e.target.value)}
            rows={3}
            className="form-input resize-none"
            placeholder={"LED light package\nAir ride suspension\nPolished aluminum wheels"}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#FFC700] rounded inline-block" />
          Images
        </h3>

        {/* Current images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Truck image ${i + 1}`}
                  className="w-20 h-14 object-cover rounded-lg border border-[#E0E0E0]"
                />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#E0E0E0] rounded-lg p-6 text-center cursor-pointer hover:border-[#3A6EA5] transition-colors group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="text-2xl mb-1">{uploading ? "⏳" : "📷"}</div>
          <p className="text-sm text-[#9E9E9E] group-hover:text-[#3A6EA5] transition-colors">
            {uploading ? "Uploading..." : "Click to upload images"}
          </p>
          <p className="text-xs text-[#9E9E9E] mt-0.5">JPG, PNG, WebP — multiple allowed</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary flex-1 justify-center disabled:opacity-60"
        >
          {saving ? "Saving..." : initial ? "Update Truck" : "Add Truck"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
