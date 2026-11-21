import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { node: <CountUp to={92} suffix='%' />, label: "of unread mail never needs you" },
  { node: <CountUp to={15} />, label: "emails triaged per run, in one call" },
  { node: <CountUp to={1} prefix='<' suffix='¢' />, label: "typical AI cost per run" },
  { node: <CountUp to={0} />, label: "emails ever sent without your click" },
];

const BARS = ["bg-brand", "bg-foreground/70", "bg-foreground/45", "bg-foreground/25"];
const GLOWS = ["bg-brand/12", "bg-brand/10", "bg-brand/10", "bg-brand/10"];

export function Stats() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {STATS.map(({ node, label }, i) => (
        <Reveal
          key={label}
          delay={i * 90}
          className='group lift relative overflow-hidden rounded-3xl border bg-card p-8 hover:border-foreground/15 hover:shadow-soft'
        >
          <div className={`pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${GLOWS[i]}`} />
          <span className={`relative mb-6 block h-1 w-10 rounded-full ${BARS[i]}`} />
          <p className='relative text-5xl font-bold tracking-tight sm:text-6xl'>{node}</p>
          <p className='relative mt-3 text-[17px] leading-snug text-muted-foreground'>{label}</p>
        </Reveal>
      ))}
    </div>
  );
}
