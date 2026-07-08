import { createFileRoute } from "@tanstack/react-router";
import {
  Instagram,
  MessageCircleMore,
  MessageCircleCode,
  MessageCircleHeart,
  ArrowUpRight,
  Bell,
  Users,
  Zap,
  BadgePercent,
} from "lucide-react";
import { useRef } from "react";

import { ParticleField } from "@/components/ParticleField";
import polarBear from "@/assets/polar-bear.png";
import auroraBg from "@/assets/aurora-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Polar Promoções — Ofertas em tempo real no WhatsApp" },
      {
        name: "description",
        content:
          "Entre nos grupos da Polar Promoções e receba as melhores ofertas de Amazon, Mercado Livre e Shopee em primeira mão, direto no seu WhatsApp.",
      },
      { property: "og:title", content: "Polar Promoções — Ofertas em tempo real" },
      {
        property: "og:description",
        content: "Grupos de promoções com as melhores ofertas de Amazon, Mercado Livre e Shopee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// TODO: substituir '#' pelos links reais dos grupos e habilitar rastreamento de cliques.
const groups = [
  {
    name: "Grupo WhatsApp #1",
    desc: "As promoções mais quentes do dia, sem filtro. Amazon, ML e Shopee.",
    icon: MessageCircleMore,
    tag: "Mais popular",
    href: "#",
    tone: "cyan" as const,
  },
  {
    name: "Grupo WhatsApp #2",
    desc: "Novas ofertas e cupons exclusivos para membros.",
    icon: MessageCircleCode,
    tag: "#2",
    href: "#",
    tone: "violet" as const,
  },
  {
    name: "Grupo WhatsApp #3",
    desc: "Ofertas especiais de produtos e promoções relâmpago.",
    icon: MessageCircleHeart,
    tag: "#3",
    href: "#",
    tone: "magenta" as const,
  },
];

const socials = [
  { name: "WhatsApp", icon: MessageCircleMore, href: "#", label: "Entrar no WhatsApp da Polar Promoções" },
  { name: "Instagram", icon: Instagram, href: "#", label: "Seguir a Polar Promoções no Instagram" },
];

const stats = [
  { icon: Users, value: "100%+", label: "Comunidade gratuita" },
  { icon: Zap, value: "24/7", label: "Ofertas em tempo real" },
  { icon: BadgePercent, value: "300+", label: "Achados por dia" },
];

const stores = ["Amazon", "Mercado Livre", "Shopee"];

function toneColor(tone: "cyan" | "violet" | "magenta") {
  return tone === "cyan"
    ? "var(--aurora-cyan)"
    : tone === "violet"
      ? "var(--aurora-violet)"
      : "var(--aurora-magenta)";
}

function TiltCard({
  group,
  index,
}: {
  group: (typeof groups)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 10;
    const ry = (px - 0.5) * 12;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  const Icon = group.icon;

  return (
    <a
      ref={ref}
      href={group.href}
      aria-label={`Entrar no grupo ${group.name}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ animationDelay: `${index * 110}ms`, transformStyle: "preserve-3d" }}
      className="glass card-shine animate-rise group relative flex flex-col items-start overflow-hidden rounded-2xl p-6 text-left transition-[transform,border-color,box-shadow] duration-300 will-change-transform hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--aurora-cyan)_45%,transparent)]"
    >
      {/* pointer-follow glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, ${toneColor(
            group.tone,
          )} 22%, transparent), transparent 60%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
        style={{ background: toneColor(group.tone) }}
      />
      <div className="relative mb-4 flex w-full items-center justify-between">
        <span className="gradient-border inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {group.tag}
        </span>
      </div>
      <h3 className="relative font-display text-lg font-semibold text-foreground">{group.name}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{group.desc}</p>
      <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Entrar agora
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

function Index() {
  return (
    <div className="grain relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <img
        src={auroraBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1280}
        className="animate-drift pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-40"
      />
      {/* Animated aurora ribbons */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="aurora-ribbon top-[6%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--aurora-teal), var(--aurora-cyan), transparent)",
          }}
        />
        <div
          className="aurora-ribbon top-[32%]"
          style={{
            animationDuration: "20s",
            animationDelay: "-4s",
            background:
              "linear-gradient(90deg, transparent, var(--aurora-violet), var(--aurora-magenta), transparent)",
          }}
        />
        <div
          className="aurora-ribbon top-[62%]"
          style={{
            animationDuration: "24s",
            animationDelay: "-9s",
            background:
              "linear-gradient(90deg, transparent, var(--aurora-cyan), var(--aurora-violet), transparent)",
          }}
        />
        <div
          className="glow-orb left-[18%] top-[20%] h-64 w-64"
          style={{ background: "var(--aurora-cyan)" }}
        />
        <div
          className="glow-orb right-[12%] top-[46%] h-72 w-72"
          style={{ background: "var(--aurora-magenta)", animationDelay: "-3s" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_oklab,var(--aurora-cyan)_22%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background"
      />
      <ParticleField />

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-14 text-center sm:pt-20">
        {/* Badge */}
        <span className="glass animate-rise mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Ofertas atualizadas em tempo real
        </span>

        {/* Logo */}
        <div className="animate-logo-float relative mb-2">
          <span
            aria-hidden="true"
            className="glow-orb left-1/2 top-1/2 h-56 w-56 opacity-60"
            style={{ background: "var(--aurora-violet)" }}
          />
          <img
            src={polarBear}
            alt="Mascote urso polar da Polar Promoções"
            width={1024}
            height={1024}
            className="animate-logo-pulse relative h-44 w-44 object-contain sm:h-56 sm:w-56"
          />
        </div>

        {/* Title */}
        <h1 className="animate-rise font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          <span className="text-aurora">Polar</span>{" "}
          <span className="text-foreground">Promoções</span>
        </h1>

        {/* Description with highlighted words */}
        <p className="animate-rise mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          A comunidade que garimpa as{" "}
          <strong className="font-semibold text-ice">melhores ofertas</strong> da{" "}
          <strong className="font-semibold text-primary">Amazon</strong>,{" "}
          <strong className="font-semibold text-secondary">Mercado Livre</strong> e{" "}
          <strong className="font-semibold text-accent">Shopee</strong> — e manda{" "}
          <strong className="font-semibold text-ice">direto no seu WhatsApp</strong>, na hora que sai.
        </p>

        {/* Primary CTA */}
        <a
          href="#grupos"
          className="gradient-border glow-cyan btn-shimmer animate-rise mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground transition-transform duration-200 hover:scale-105"
        >
          <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
          Entrar em um grupo agora
        </a>

        {/* Stats */}
        <section
          aria-label="Números da comunidade"
          className="animate-rise mt-14 grid w-full max-w-xl grid-cols-3 gap-3 sm:gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass animate-float-soft flex flex-col items-center rounded-2xl px-2 py-5"
            >
              <s.icon className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
              <span className="animate-count-glow font-display text-2xl font-bold text-foreground sm:text-3xl">
                {s.value}
              </span>
              <span className="mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
                {s.label}
              </span>
            </div>
          ))}
        </section>

        {/* Store marquee */}
        <section aria-label="Lojas parceiras" className="mt-14 w-full">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Ofertas de
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
              {[...stores, ...stores].map((store, i) => (
                <span
                  key={`${store}-${i}`}
                  className="font-display text-lg font-semibold text-muted-foreground/70 transition-colors hover:text-primary sm:text-xl"
                  aria-hidden={i >= stores.length}
                >
                  {store}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Group cards */}
        <section id="grupos" aria-label="Grupos de promoções" className="mt-20 w-full scroll-mt-8">
          <h2 className="font-display mb-2 text-2xl font-semibold sm:text-3xl">
            Escolha seu <span className="text-aurora">grupo</span>
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Entre nos grupos do WhatsApp e receba as ofertas que combinam com você.
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {groups.map((g, i) => (
              <TiltCard key={g.name} group={g} index={i} />
            ))}
          </div>
        </section>

        {/* Socials */}
        <section aria-label="Redes sociais" className="mt-20">
          <p className="mb-5 text-sm text-muted-foreground">Também estamos aqui</p>
          <div className="flex items-center justify-center gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.label}
                className="gradient-border group flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-110 hover:glow-magenta"
              >
                <s.icon
                  className="h-6 w-6 text-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Polar Promoções — Todas as ofertas com carinho gelado. ❄️</p>
        </footer>
      </main>
    </div>
  );
}
