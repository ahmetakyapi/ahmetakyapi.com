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
    <footer className="border-t border-gray-100 dark:border-white/[0.05] mt-8 footer-safe">
      <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 shrink-0">
            <rect width="28" height="28" rx="8.5" fill="url(#flg)"/>
            <path d="M14 8L20 19H8L14 8Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
            <defs>
              <linearGradient id="flg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c6fe0"/>
                <stop offset="0.55" stopColor="#4f7ef5"/>
                <stop offset="1" stopColor="#3b8ef0"/>
              </linearGradient>
            </defs>
          </svg>
          <p className="text-xs dark:text-gray-600 text-gray-400 font-mono">
            © {new Date().getFullYear()} ahmetakyapi.com
          </p>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-0.5"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2.5 sm:p-2 rounded-lg text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
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
          className="text-[11px] dark:text-gray-600 text-gray-400 font-mono"
        >
          Next.js · TailwindCSS · Framer Motion
        </motion.p>
      </div>
    </footer>
  )
}
