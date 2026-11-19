"use client";
export function ConfirmSubmit({ label, message, className = "" }: { label: string; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {label}
    </button>
  );
}
