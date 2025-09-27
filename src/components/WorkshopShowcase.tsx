import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

const WORKSHOP_ITEMS: Array<{
  title: string;
  description: string;
  price: string;
  availability: string;
  accentFrom: string;
  accentTo: string;
}> = [
  {
    title: "Liquid Skyline Poster Set",
    description: "Hand-numbered silk prints with cyan glass overlays and foil highlights for nighttime lighting.",
    price: "1 200 ₽",
    availability: "Limited 50",
    accentFrom: "rgba(56,189,248,0.75)",
    accentTo: "rgba(129,140,248,0.65)",
  },
  {
    title: "Aurora Keycap Collection",
    description: "PBT keycaps tinted to the SKY gradient with soft-touch finish and laser-etched legends.",
    price: "2 900 ₽",
    availability: "Group buy",
    accentFrom: "rgba(236,72,153,0.78)",
    accentTo: "rgba(59,130,246,0.62)",
  },
  {
    title: "Neon Synthwave Sticker Pack",
    description: "Vinyl holographic decals for laptops, decks, and road cases—waterproof and UV sealed.",
    price: "480 ₽",
    availability: "In stock",
    accentFrom: "rgba(148,163,255,0.8)",
    accentTo: "rgba(16,185,129,0.7)",
  },
];

export default function WorkshopShowcase({ sectionId }: { sectionId?: string }) {
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-zinc-400">
            <Sparkles size={14} /> Workshop
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-white">Featured drops</h2>
          <p className="mt-1 text-sm text-zinc-300/80">
            Curated goods from the community marketplace. Trade safely and showcase your craft.
          </p>
        </div>
        {sectionId ? (
          <Link to={`/forum/section/${sectionId}`} className="btn btn-primary inline-flex items-center gap-2">
            View board
            <ArrowRight size={14} />
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {WORKSHOP_ITEMS.map((item) => (
          <article
            key={item.title}
            className="relative overflow-hidden rounded-2xl border border-white/10 p-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${item.accentFrom}, ${item.accentTo})` }}
          >
            <div className="absolute inset-0 bg-black/25" aria-hidden />
            <div className="relative z-[1] flex h-full flex-col gap-3 text-white">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/70">
                <span>{item.availability}</span>
                <ShoppingBag size={18} className="text-white/70" />
              </div>
              <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
              <p className="text-sm text-white/80">{item.description}</p>
              <div className="mt-auto flex items-center justify-between text-sm font-semibold">
                <span>{item.price}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.32em]">
                  Offer
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
