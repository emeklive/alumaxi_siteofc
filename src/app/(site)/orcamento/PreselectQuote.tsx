"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Category, Product } from "@/types";
import { QuoteForm } from "@/components/forms/QuoteForm";

function Inner({ products, categories }: { products: Product[]; categories: Category[] }) {
  const slug = useSearchParams().get("produto");
  const pre = slug ? products.find((p) => p.slug === slug) ?? null : null;
  return <QuoteForm key={slug ?? "none"} products={products} categories={categories} preselect={pre} />;
}

/** Lê ?produto=slug para pré-preencher o primeiro item do orçamento. */
export function PreselectQuote(props: { products: Product[]; categories: Category[] }) {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <Inner {...props} />
    </Suspense>
  );
}
