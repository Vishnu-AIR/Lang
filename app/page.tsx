'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart2, TrendingUp, Zap, ArrowRight } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto flex justify-between items-center py-4 px-4">
          <motion.h1 
            className="text-2xl font-bold text-slate-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            SocialFlow Insights
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/stats" passHref>
              <Button variant="outline" className="text-slate-800 border-slate-300 hover:bg-slate-100">
                View Stats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ opacity, scale }}
          >
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center opacity-10"></div>
          </motion.div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Unlock Social Media Insights with Langflow
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Harness the power of AI to compare Reels vs Carousels and optimize your content strategy for maximum engagement
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/stats" passHref>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">How SocialFlow Insights Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Enter API Key", description: "Securely connect to your Langflow instance", icon: Zap },
                { title: "Choose Comparison", description: "Select what you want to compare (e.g., Reels vs Carousels)", icon: BarChart2 },
                { title: "Get Insights", description: "Receive detailed stats and actionable insights", icon: TrendingUp }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-700">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Why Choose SocialFlow Insights?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Comprehensive Analytics", description: "Get deep insights into your social media performance across different content types.", icon: BarChart2 },
                { title: "Content Strategy Optimization", description: "Make data-driven decisions to improve your content strategy and boost engagement.", icon: TrendingUp },
                { title: "Powered by Langflow", description: "Leverage the power of Langflow for accurate and insightful social media analytics.", icon: Zap }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                      <CardTitle className="text-slate-700">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        

        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Optimize Your Social Media Strategy?</h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/stats" passHref>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Analyzing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SocialFlow Insights</h3>
              <p className="text-sm text-slate-300">Empowering your social media strategy with Langflow-powered analytics.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Stats", "About Us", "Contact"].map((link, index) => (
                  <li key={index}>
                    <Link href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-")}`} className="hover:text-blue-300 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-sm mb-2 text-slate-300">Stay updated with our latest features and insights.</p>
              <form className="flex">
                <input type="email" placeholder="Your email" className="px-3 py-2 bg-slate-700 text-white rounded-l-md focus:outline-none flex-grow" />
                <Button type="submit" className="bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-300">
            <p>&copy; 2025 SocialFlow Insights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

