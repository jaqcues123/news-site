"use client";

import { useState, useEffect, useCallback } from "react";
import { Truck } from "@/lib/types";
import TruckForm from "./TruckForm";

// ── Auth ──────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      onLogin();
    } else {
      const data = await res.json();
      setError(data.error ?? "Invalid password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFC700] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[#111111] font-black text-xl">N</span>
          </div>
          <h1 className="text-white text-2xl font-black">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">New England Wrecker Sales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3A6EA5] transition-colors"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; truck: Truck };

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTrucks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trucks");
      const data = await res.json();
      setTrucks(data);
    } catch {
      console.error("Failed to load trucks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadTrucks();
  }, [authed, loadTrucks]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/trucks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTrucks((prev) => prev.filter((t) => t.id !== id));
    }
    setDeleteId(null);
  };

  const handleSave = () => {
    setModal({ mode: "closed" });
    loadTrucks();
  };

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-page pt-16">
      {/* Admin header */}
      <div className="bg-[#111111] sticky top-16 z-40">
        <div className="container-site py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">Inventory Manager</h1>
            <p className="text-gray-400 text-xs">New England Wrecker Sales</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModal({ mode: "add" })}
              className="btn-primary text-sm py-2"
            >
              + Add Truck
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-site py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["available", "pending", "sold"] as const).map((status) => {
            const count = trucks.filter((t) => t.status === status).length;
            return (
              <div key={status} className="card p-4">
                <div className="text-2xl font-black text-primary">{count}</div>
                <div className="text-xs text-muted uppercase tracking-wide mt-0.5 capitalize">
                  {status}
                </div>
              </div>
            );
          })}
          <div className="card p-4">
            <div className="text-2xl font-black text-primary">{trucks.length}</div>
            <div className="text-xs text-muted uppercase tracking-wide mt-0.5">
              Total Units
            </div>
          </div>
        </div>

        {/* Truck Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
            <h2 className="font-bold text-primary">All Trucks</h2>
            {loading && (
              <span className="text-xs text-[#9E9E9E] animate-pulse">Loading...</span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-page">
                  {["Title", "Type", "Price", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {trucks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[#9E9E9E]">
                      No trucks yet.{" "}
                      <button
                        onClick={() => setModal({ mode: "add" })}
                        className="text-[#3A6EA5] hover:underline"
                      >
                        Add the first one.
                      </button>
                    </td>
                  </tr>
                )}
                {trucks.map((truck) => (
                  <tr key={truck.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="px-4 py-3 font-medium text-primary max-w-[280px]">
                      <div className="truncate">{truck.title}</div>
                      <div className="text-xs text-muted truncate">{truck.id}</div>
                    </td>
                    <td className="px-4 py-3 capitalize text-secondary">{truck.type}</td>
                    <td className="px-4 py-3 text-secondary whitespace-nowrap">
                      {truck.price > 0 ? `$${truck.price.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`status-badge ${
                          truck.status === "available"
                            ? "status-available"
                            : truck.status === "pending"
                            ? "status-pending"
                            : "status-sold"
                        }`}
                      >
                        {truck.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setModal({ mode: "edit", truck })}
                          className="text-[#3A6EA5] hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(truck.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GitHub note */}
        <p className="mt-4 text-xs text-[#9E9E9E] text-center">
          In production, changes are committed to GitHub and Vercel will auto-deploy within ~30s.
          Make sure <code className="bg-white px-1 rounded">GITHUB_TOKEN</code> is set in your Vercel environment variables.
        </p>
      </div>

      {/* Add/Edit modal */}
      {modal.mode !== "closed" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F5F5]">
              <h2 className="font-bold text-[#111111] text-lg">
                {modal.mode === "add" ? "Add New Truck" : "Edit Truck"}
              </h2>
              <button
                onClick={() => setModal({ mode: "closed" })}
                className="w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#9E9E9E] hover:text-[#111111] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TruckForm
                initial={modal.mode === "edit" ? modal.truck : undefined}
                onSave={handleSave}
                onCancel={() => setModal({ mode: "closed" })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-[#111111] text-lg mb-2">Delete Truck?</h3>
            <p className="text-[#9E9E9E] text-sm mb-6">
              This action cannot be undone. The truck will be permanently removed from inventory.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 justify-center inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
