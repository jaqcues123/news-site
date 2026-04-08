"use client";

import { useState } from "react";
import { InquiryFormData } from "@/lib/types";

interface InquiryFormProps {
  truckId: string;
  truckTitle: string;
}

export default function InquiryForm({ truckId, truckTitle }: InquiryFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload: InquiryFormData = { truck_id: truckId, truck_title: truckTitle, ...form };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed.");
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="form-panel text-center">
        <div className="text-3xl mb-3 text-green-500">&#10003;</div>
        <h3 className="font-bold text-primary text-lg mb-1">Message Sent!</h3>
        <p className="text-muted text-sm">
          We&apos;ll be in touch shortly to discuss this truck with you.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-[#3A6EA5] text-sm hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="form-panel">
      <h3 className="font-bold text-primary text-lg mb-1">Inquire About This Truck</h3>
      <p className="text-muted text-sm mb-5">
        Fill out the form and our sales team will reach out within 1 business day.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="form-label">
            Full Name <span className="text-[#FFC700]">*</span>
          </label>
          <input
            type="text" id="name" name="name"
            value={form.name} onChange={handleChange}
            required placeholder="John Smith"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email Address <span className="text-[#FFC700]">*</span>
          </label>
          <input
            type="email" id="email" name="email"
            value={form.email} onChange={handleChange}
            required placeholder="john@example.com"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel" id="phone" name="phone"
            value={form.phone} onChange={handleChange}
            placeholder="(603) 555-0100"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            Message <span className="text-[#FFC700]">*</span>
          </label>
          <textarea
            id="message" name="message"
            value={form.message} onChange={handleChange}
            required rows={4}
            placeholder="I'm interested in this truck and would like more information..."
            className="form-input resize-none"
          />
        </div>

        {status === "error" && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
