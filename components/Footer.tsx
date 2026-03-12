'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const socials = [
  { icon: Github,   href: 'https://github.com/ahmetakyapi', label: 'GitHub' },
  { icon: Twitter,  href: '#',                              label: 'Twitter' },
  { icon: Linkedin, href: '#',                              label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:ahmet@ahmetakyapi.com',  label: 'E-posta' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/[0.05] mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold">
            A
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
            © {new Date().getFullYear()} ahmetakyapi.com
          </p>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>

        {/* Right */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[11px] text-gray-400 dark:text-gray-600 font-mono"
        >
          Next.js · TailwindCSS · Framer Motion
        </motion.p>
      </div>
    </footer>
  )
}
