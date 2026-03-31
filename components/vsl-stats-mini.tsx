"use client"

import { motion } from "framer-motion"

interface StatItemProps {
  number: string
  label: string
  description: string
  id: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
} as const

function StatItem({ number, label, description, id }: StatItemProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="relative p-6 md:p-10 border-r border-white/5 last:border-r-0 flex flex-col group transition-all duration-700"
    >
      <div className="flex items-center gap-4 mb-6 opacity-40">
        <span className="font-display text-[10px] tracking-widest text-accent font-bold">{id}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      
      <div className="relative mb-6">
         <span className="font-display text-[48px] md:text-[64px] lg:text-[80px] text-white tracking-tighter block group-hover:text-accent transition-colors duration-500 leading-none">
            {number}
         </span>
         <span className="font-display text-sm md:text-base text-accent tracking-[.3em] uppercase block mt-2 font-bold opacity-80">
            {label}
         </span>
      </div>

      <p className="font-sans text-white/50 text-base md:text-lg leading-relaxed font-medium group-hover:text-white/70 transition-colors">
         {description}
      </p>
    </motion.div>
  )
}

export default function VslStatsMini() {
  const stats = [
    {
       id: "01",
       number: "+300 tyś. zł",
       label: "Branża fitness",
       description: "Dodatkowego dochodu w 3 miesiące działań dla firmy suplementacyjnej",
    },
    {
       id: "02",
       number: "+104",
       label: "Hot Leads",
       description: "Na usługę transportu premium osób VIP w jednym miesiącu",
    },
    {
       id: "03",
       number: "+4,3 mln",
       label: "Zasięgu",
       description: "Organicznie w social mediach – regularnie 1.5 mln miesięcznie po roku współpracy",
    },
    {
       id: "04",
       number: "+12",
       label: "Miesięcy",
       description: "Średni czas współpracy z klientami – długofalowe partnerstwa oparte na wynikach",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const

  return (
    <section 
      className="bg-[#050505] border-y border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.02),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
         {stats.map((stat) => (
            <StatItem key={stat.id} {...stat} />
         ))}
      </motion.div>
    </section>
  )
}
