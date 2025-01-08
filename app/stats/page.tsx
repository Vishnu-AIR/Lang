'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Lightbulb, Wand2, Loader2 } from 'lucide-react'
import DynamicMetricsComparison from '../components/DynamicMetricsComparison'

export default function Stats() {
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('input')

  const validateApiKey = (key: string) => {
    const apiKeyRegex = /^sk-proj-[a-zA-Z0-9]{48}$/
    return apiKeyRegex.test(key)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Running handleSubmit');
    e.preventDefault();
    setError('');
    setResult('');
    setIsLoading(true);

    if (!validateApiKey(apiKey)) {
      setError('Invalid API key format. It should start with "sk-proj-" followed by 48 characters.');
      setIsLoading(false);
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt for comparison.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/fetch-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.output) {
        const res = JSON.parse(data.output)
        setResult(res.outputs[0].outputs[0].results.message.text)
        setActiveTab('results')
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(`Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompt = "Compare engagement rates between Reels and Carousels for the past month"

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-slate-800">Social Media Insights</CardTitle>
              <CardDescription>Enter your API key and prompt to analyze your social media performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="input">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-1">
                        API Key
                      </label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Enter your API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">
                        Comparison Prompt
                      </label>
                      <div className="relative">
                        <Input
                          id="prompt"
                          type="text"
                          placeholder="Enter your comparison prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          required
                          className="w-full pr-10"
                        />
                        <Wand2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md flex items-start space-x-3">
                      <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Suggested Prompt:</p>
                        <p className="text-sm text-slate-600">{suggestedPrompt}</p>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        'Analyze Performance'
                      )}
                    </Button>
                  </form>

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="results">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : result ? (
                    <DynamicMetricsComparison resultText={result} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600">No results to display yet. Submit a prompt to see the analysis.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

