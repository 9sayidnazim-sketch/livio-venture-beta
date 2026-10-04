import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Play,
  Star,
  Youtube,
} from "lucide-react";

import logo from "@/assets/livio-venture-logo.png";
import heroSky from "@/assets/hero-sky-plane.jpg";
import uniToronto from "@/assets/uni-toronto.jpg";
import uniMelbourne from "@/assets/uni-melbourne.jpg";
import uniLondon from "@/assets/uni-london.jpg";
import promoStudent from "@/assets/promo-student.jpg";
import oceanCircle from "@/assets/ocean-circle.jpg";
import cloudBanner from "@/assets/cloud-banner.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Livio Venture — Your Future Abroad Starts Here" },
      {
        name: "description",
        content:
          "Discover universities in 10+ countries, compare tuition, ranking and scholarships, and book free counselling with Livio Venture.",
      },
      { property: "og:title", content: "Livio Venture — Life beyond Borders" },
      {
        property: "og:description",
        content:
          "Study abroad made simple: find your university, get your offer, and start your life overseas.",
      },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Universities", href: "#universities" },
  { label: "Courses", href: "#journey" },
  { label: "Scholarships", href: "#finder" },
  { label: "Contact", href: "#contact" },
];

const universities = [
  {
    name: "University of Toronto",
    location: "Toronto, Canada",
    rating: "4.7",
    image: uniToronto,
  },
  {
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    rating: "4.8",
    image: uniMelbourne,
  },
  {
    name: "King's College London",
    location: "London, United Kingdom",
    rating: "4.6",
    image: uniLondon,
  },
];

const stats = [
  { value: "10,000+", label: "Students guided" },
  { value: "500+", label: "Partner universities" },
  { value: "10+", label: "Countries" },
  { value: "98%", label: "Visa success" },
];

const testimonials = [
  {
    quote:
      "I went from a shortlist of forty universities to one offer letter in eleven weeks. The counselling was honest about my budget.",
    name: "Aarav Mehta",
    detail: "MSc Data Science, Toronto",
  },
  {
    quote:
      "They handled the scholarship paperwork I would never have found on my own. I fly in September with 40% tuition covered.",
    name: "Sara Khalid",
    detail: "BBA, Melbourne",
  },
  {
    quote:
      "Visa interview prep made the difference. Calm, practical and genuinely on my side the whole way through.",
    name: "Daniel Okoro",
    detail: "MEng, London",
  },
];

const faqs = [
  {
    q: "Is counselling really free?",
    a: "Your first counselling session is free, with no obligation. We walk through your grades, budget and timeline and tell you honestly where you stand.",
  },
  {
    q: "Which countries do you cover?",
    a: "We work with universities across Canada, the UK, Australia, Ireland, Germany, the USA, New Zealand, the Netherlands, France and the UAE.",
  },
  {
    q: "Can you help with scholarships?",
    a: "Yes. We map every scholarship you qualify for at the universities on your shortlist and help you prepare each application.",
  },
  {
    q: "What about visas?",
    a: "We prepare your documentation, run mock interviews and track your application until the decision arrives.",
  },
];

function Index() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [budget, setBudget] = useState([25000]);

  const scrollCarousel = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.5), behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:flex lg:justify-between lg:px-10">
          <a href="#top" className="flex min-w-0 items-center">
            <img src={logo} alt="Livio Venture" className="h-8 w-auto shrink-0 sm:h-10" />
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-3"
          >
            Book Counselling
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-10 lg:pt-10">
          <div className="relative overflow-hidden rounded-[32px] lg:rounded-[40px]">
            <img
              src={heroSky}
              alt="Airplane taking off into a bright blue sky"
              width={1600}
              height={1008}
              className="h-[560px] w-full object-cover sm:h-[620px] lg:h-[680px]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/75 via-brand-navy/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
              <div className="flex items-start gap-6">
                <div className="hidden flex-col items-center gap-2 pt-2 sm:flex">
                  {[1, 2, 3].map((n, i) => (
                    <div key={n} className="flex flex-col items-center gap-2">
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-medium ${
                          n === 1
                            ? "border-transparent bg-background text-brand-navy"
                            : "border-background/60 text-background"
                        }`}
                      >
                        {n}
                      </span>
                      {i < 2 && <span className="h-10 w-px bg-background/50" />}
                    </div>
                  ))}
                </div>

                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-background/85">
                    Elevate your study journey
                  </p>
                  <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-background sm:text-5xl lg:text-7xl">
                    Your Future Abroad Starts Here!
                  </h1>
                  <p className="mt-5 max-w-lg text-base text-background/80">
                    Life beyond Borders. Find the right university, the right course and the funding
                    to match, guided end to end.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <Link
                      to="/universities"
                      className="rounded-full bg-brand-bright px-7 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
                    >
                      Explore Universities
                    </Link>
                    <button
                      aria-label="Watch intro"
                      className="grid h-14 w-14 place-items-center rounded-full bg-background/90 text-brand-navy transition-transform hover:scale-105"
                    >
                      <Play className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute bottom-5 right-5 hidden w-[320px] rounded-[28px] bg-background p-5 shadow-lift md:block">
              <Link
                to="/universities"
                className="flex items-center gap-1 text-sm font-medium text-brand"
              >
                Know More <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-4 flex -space-x-3">
                {[uniToronto, uniMelbourne, uniLondon].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <p className="mt-4 text-base font-bold">Top Destinations.</p>
              <p className="text-sm text-muted-foreground">
                Discover universities in 10+ countries.
              </p>
            </div>
          </div>
        </section>

        {/* Partner strip */}
        <section className="mx-auto mt-12 max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col gap-6 rounded-[28px] bg-secondary px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex shrink-0 items-center gap-3 rounded-full bg-background px-4 py-2">
              <span className="text-sm font-medium">Follow</span>
              {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#contact"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-45">
              {["QS Rankings", "British Council", "IDP", "ETS", "Cambridge"].map((b) => (
                <span key={b} className="text-base font-bold tracking-tight text-brand-navy">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Universities carousel */}
        <section id="universities" className="mx-auto mt-24 max-w-7xl px-5 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold sm:text-5xl">Popular Universities</h2>
              <p className="mt-3 text-muted-foreground">
                Compare tuition, ranking and scholarships in one place
              </p>
            </div>
            <div className="flex gap-3">
              <button
                aria-label="Previous"
                onClick={() => scrollCarousel(-1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next"
                onClick={() => scrollCarousel(1)}
                className="grid h-12 w-12 place-items-center rounded-full bg-ink text-background transition-transform hover:scale-105"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...universities, ...universities].map((u, i) => (
              <Link
                key={i}
                to="/universities"
                className="group block w-[290px] shrink-0 snap-start sm:w-[360px]"
              >
                <div className="relative overflow-hidden rounded-[32px]">
                  <img
                    src={u.image}
                    alt={u.name}
                    loading="lazy"
                    width={912}
                    height={1104}
                    className="h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[440px]"
                  />
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-brand-bright px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" /> {u.rating}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{u.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {u.location}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className="mx-auto mt-28 max-w-7xl px-5 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-5xl">Your Journey Abroad Made Simple!</h2>
            <p className="mt-4 text-muted-foreground">
              Three calm steps, one dedicated counsellor, and no guesswork between your shortlist
              and your boarding pass.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center">
            <div className="rounded-[32px] bg-secondary p-8 transition-shadow hover:shadow-soft">
              <span className="text-sm font-medium text-brand">01</span>
              <h3 className="mt-4 text-2xl font-bold">Find Your University</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                We match your grades, budget and ambitions against 500+ partner universities and
                build a shortlist you can trust.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-brand p-8 text-primary-foreground shadow-lift lg:-translate-y-8 lg:p-10">
              <img
                src={oceanCircle}
                alt=""
                loading="lazy"
                className="absolute -right-6 -top-6 h-28 w-28 rounded-full object-cover opacity-90"
              />
              <span className="text-sm font-medium opacity-80">02</span>
              <h3 className="mt-4 text-2xl font-bold">Apply &amp; Get Your Offer</h3>
              <p className="mt-3 text-sm opacity-85">
                Applications, essays, scholarships and deadlines handled together, so your offer
                letter arrives without the panic.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-1 text-sm font-medium"
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-[32px] bg-secondary p-8 transition-shadow hover:shadow-soft">
              <span className="text-sm font-medium text-brand">03</span>
              <h3 className="mt-4 text-2xl font-bold">Fly &amp; Start Your Life</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Visa prep, housing, banking and arrival support, right up to your first week on
                campus.
              </p>
            </div>
          </div>
        </section>

        {/* Promo */}
        <section id="about" className="mx-auto mt-28 max-w-7xl px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <img
                src={promoStudent}
                alt="Smiling student on campus"
                loading="lazy"
                width={1008}
                height={1200}
                className="h-[420px] w-full rounded-[36px] object-cover sm:h-[520px]"
              />
              <div className="mt-[-40px] ml-6 w-fit rounded-[28px] bg-background p-6 shadow-lift">
                <p className="text-3xl font-bold text-brand">20% OFF</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  On counselling till 31 December
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold uppercase leading-[1.05] sm:text-5xl lg:text-6xl">
                Unleash your global potential with Livio
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <p className="text-sm text-muted-foreground">
                  Since day one we have believed a student's postcode should never decide their
                  horizon. Our counsellors have lived the move themselves.
                </p>
                <p className="text-sm text-muted-foreground">
                  From the first shortlist to your first semester, one team stays with you, and
                  every recommendation is one we would give our own family.
                </p>
              </div>
              <a
                href="#contact"
                className="group relative mt-10 flex h-32 items-center justify-between overflow-hidden rounded-[32px] px-8"
              >
                <img
                  src={cloudBanner}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="relative text-xl font-bold text-brand-navy sm:text-2xl">
                  Book Free Counselling
                </span>
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-ink text-background">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Finder */}
        <section id="finder" className="mx-auto mt-28 max-w-7xl px-5 lg:px-10">
          <div className="rounded-[36px] bg-secondary p-8 sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Find your fit in a minute</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a yearly tuition budget and a destination, and we will send a shortlist with
              scholarships attached.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">
              <div>
                <label className="text-sm font-medium">
                  Yearly budget: ${(budget[0] ?? 0).toLocaleString()}
                </label>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  min={5000}
                  max={70000}
                  step={1000}
                  className="mt-4"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Destination</label>
                <Select defaultValue="canada">
                  <SelectTrigger className="mt-3 h-12 rounded-full border-transparent bg-background px-5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <a
                href="#contact"
                className="grid h-12 place-items-center rounded-full bg-brand-bright px-10 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Search
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto mt-20 max-w-7xl px-5 lg:px-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[28px] border border-border p-7">
                <p className="text-3xl font-bold text-brand sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto mt-28 max-w-7xl px-5 lg:px-10">
          <h2 className="max-w-xl text-3xl font-bold sm:text-5xl">
            Students who already made the move
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-[32px] bg-secondary p-8 transition-shadow hover:shadow-soft"
              >
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 text-base leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-28 max-w-4xl px-5 lg:px-10">
          <h2 className="text-center text-3xl font-bold sm:text-5xl">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="mb-3 rounded-[24px] border-none bg-secondary px-6"
              >
                <AccordionTrigger className="text-left text-base font-bold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section id="contact" className="mx-auto mt-28 max-w-7xl px-5 lg:px-10">
          <div className="rounded-[36px] bg-brand-navy px-8 py-16 text-center text-primary-foreground sm:px-16">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-5xl">
              Life beyond Borders starts with one conversation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm opacity-80">
              Book a free 30-minute counselling call. No pressure, no obligation, just a clear
              picture of what is possible.
            </p>
            <a
              href="mailto:hello@livioventure.com"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 text-sm font-medium text-brand-navy transition-transform hover:-translate-y-0.5"
            >
              Book Free Counselling <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-24 max-w-7xl px-5 pb-14 lg:px-10">
        <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-4">
          <div>
            <img src={logo} alt="Livio Venture" className="h-9 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Study-abroad counselling and university discovery for students who want a life beyond
              borders.
            </p>
          </div>
          <div>
            <p className="font-bold">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-brand">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> hello@livioventure.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +971 4 000 0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Dubai, United Arab Emirates
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold">Follow</p>
            <div className="mt-4 flex gap-3">
              {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-brand-navy transition-colors hover:bg-brand hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Livio Venture. Life beyond Borders.
        </p>
      </footer>
    </div>
  );
}
