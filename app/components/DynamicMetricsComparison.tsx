'use client'

import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"

interface DynamicMetricsComparisonProps {
    resultText: string
}

interface MetricData {
    [key: string]: number
}

interface ChartData {
    name: string
    [key: string]: string | number
}

export default function DynamicMetricsComparison({ resultText }: DynamicMetricsComparisonProps) {
    // Process the text input
    const { formattedText, chartData, pieData } = useMemo(() => {
        const lines = resultText.split('\n') // Split text into lines
        const formattedLines: string[] = [] // Array for formatted text
        const metrics: { [category: string]: MetricData } = {} // Object to store metrics
        let currentCategory = '' // Track the current category

        lines.forEach((line) => {
            if (line.startsWith('####')) {
                // Bold the category header
                currentCategory = line.replace('####', '').trim()
                formattedLines.push(`<strong>${currentCategory}</strong>`)
                metrics[currentCategory] = {} // Initialize metrics for this category
            } else if (line.startsWith('- **')) {
                // Parse property and value
                const [property, value] = line.replace('- **', '').split(':**')
                if (property && value) {
                    const cleanProperty = property.trim()
                    const cleanValue = parseInt(value.trim(), 10)
                    if (!isNaN(cleanValue)) {
                        metrics[currentCategory][cleanProperty] = cleanValue // Add to metrics
                    }
                }
                formattedLines.push(line) // Add the line to formatted text
            } else {
                formattedLines.push(line) // Add other lines without formatting
            }
        })

        // Prepare data for the chart
        const chartData: ChartData[] = Object.keys(metrics[Object.keys(metrics)[0]] || {}).map((metric) => {
            const data: ChartData = { name: metric }
            Object.keys(metrics).forEach((category) => {
                data[category] = metrics[category][metric] || 0
            })
            return data
        })

        // Prepare data for the pie charts
        const pieData = Object.keys(metrics).map((category) => {
            return Object.keys(metrics[category]).map((metric) => ({
                name: metric,
                value: metrics[category][metric],
            }))
        })
        console.log(pieData)
        return {
            formattedText: formattedLines.join('<br />'),
            chartData,
            pieData,
        }
    }, [resultText])

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    // Render the chart and formatted text
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800">Analysis Results</h3>
            
            {/* Display formatted text */}
            <div className="bg-white p-4 rounded-md shadow">
                <p className="text-slate-600 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedText }} />
            </div>

            {/* Render bar chart */}
            <div className="bg-white p-4 rounded-md shadow">
                <h4 className="text-lg font-medium text-slate-800 mb-2">Metrics Comparison</h4>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                        <Legend />
                        {Object.keys(chartData[0] || {}).map((key) =>
                            key !== 'name' ? (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={`hsl(${Object.keys(chartData[0]).indexOf(key) * 60}, 70%, 50%)`}
                                />
                            ) : null
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Render pie charts */}
            {pieData.map((data, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow">
                    <h4 className="text-lg font-medium text-slate-800 mb-2">{Object.keys(pieData)[index]} Metrics</h4>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    )
}
