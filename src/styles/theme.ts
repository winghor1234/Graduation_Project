/* Admin design tokens — maps to CSS variables defined in globals.css */
export const theme = {

  /* ── Layout ── */
  bg:      "bg-admin-bg",
  sidebar: "bg-brand-navy",
  header:  "bg-admin-card border-b border-admin-border",
  card:    "bg-admin-card border border-admin-border rounded-xl shadow-sm",
  input:   "bg-gray-50 border border-admin-border focus-within:border-brand-blue",

  /* ── States ── */
  hover:  "hover:bg-brand-navy-hover",
  active: "bg-brand-navy-dark border-l-4 border-brand-blue text-white",

  /* ── Text ── */
  text:    "text-admin-text",
  subText: "text-admin-muted",

  /* ── Primary (blue) ── */
  primary:       "text-brand-blue",
  primaryBg:     "bg-brand-blue",
  primarySoft:   "bg-brand-blue-soft",
  primaryBorder: "border-brand-blue",

  /* ── Gradients (Tailwind v4) ── */
  primaryGradient: "bg-linear-to-r from-brand-blue/10 to-brand-blue/5",
  avatarGradient:  "bg-linear-to-br from-brand-navy to-brand-blue",
  cardGradient:    "bg-linear-to-br from-brand-blue-soft to-blue-50",

  /* ── Glow ── */
  glow:       "shadow-[0_0_10px_rgba(74,144,217,0.10)]",
  glowStrong: "shadow-[0_0_20px_rgba(74,144,217,0.15)]",

  /* ── KPI cards ── */
  successCard: "bg-linear-to-br from-emerald-500 to-emerald-400 text-white",
  dangerCard:  "bg-linear-to-br from-red-500 to-red-400 text-white",
  infoCard:    "bg-linear-to-br from-brand-blue to-sky-400 text-white",
  purpleCard:  "bg-linear-to-br from-indigo-500 to-brand-blue text-white",

  /* ── Soft badges ── */
  successSoft: "bg-emerald-50 border-emerald-200 text-emerald-700",
  dangerSoft:  "bg-red-50 border-red-200 text-red-700",
  warningSoft: "bg-yellow-50 border-yellow-200 text-yellow-700",
  infoSoft:    "bg-brand-blue-soft border-brand-blue text-brand-blue",

  /* ── Chart ── */
  chartBar: "bg-linear-to-t from-brand-navy to-brand-blue",

  /* ── Status text ── */
  successText: "text-emerald-600",
  warningText: "text-yellow-600",
  dangerText:  "text-red-600",
}