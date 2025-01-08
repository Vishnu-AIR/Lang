// 'use client'

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DynamicMetricsComparisonProps {
  resultText: string;
}

interface MetricData {
  [key: string]: number;
}

interface ChartData {
  name: string;
  [key: string]: string | number;
}

export default function DynamicMetricsComparison({ resultText }: DynamicMetricsComparisonProps) {
  // Using useMemo to parse and process input text based on Python logic
  
    const allowedKeys = new Set(['Likes', 'Shares', 'Comments', 'Reach', 'Impressions']);
    allowedKeys.forEach(p => {
        resultText = resultText.replaceAll(`**${p}:**`, `${p}:`);
      });

  const { chartData, pieData } = useMemo(() => {

    
      
      

    const sections = resultText.split(/\n\d+\.\s/); // Split sections based on numbers
    console.log(sections)
    const data: Record<string, MetricData> = {}; // Dictionary to store parsed data

    sections.slice(1).forEach((section) => {
      const categoryMatch = section.match(/\*\*(.*?)\*\*/); // Extract category name
      if (!categoryMatch) return; // Skip sections without valid category

      const category = categoryMatch[1].trim();
      const metricPattern = /-\s+(.*?):\s+(\d+)/g; // Pattern to extract metrics
      const metrics: MetricData = {};
      const allowedKeys = new Set(['Likes', 'Shares', 'Comments', 'Reach', 'Impressions']);
      let match;
      while ((match = metricPattern.exec(section))) {
        const key = match[1].trim();
        const value = parseInt(match[2]);
        
        if (allowedKeys.has(key)) { // Filter metrics by allowed keys
          metrics[key] = value;
        }
      }

      data[category] = metrics; // Add metrics to the category
    });

    // Prepare chart data (bar chart)
    const chartData: ChartData[] = Object.keys(data[Object.keys(data)[0]] || {}).map((metric) => {
      const row: ChartData = { name: metric };
      Object.keys(data).forEach((category) => {
        row[category] = data[category][metric] || 0;
      });
      return row;
    });

    // Prepare pie chart data (one per category)
    const pieData = Object.entries(data).map(([category, metrics]) => {
      return {
        category,
        data: Object.entries(metrics).map(([metric, value]) => ({
          name: metric,
          value,
        })),
      };
    });
   

    return { chartData, pieData };
  }, [resultText]);

const COLORS = ['#57167E','#F7B7A3', '#FFF1C9', '#EA5F89', '#9B3192'];

  // Render the chart and formatted text
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800">Analysis Results</h3>
  
      <pre className="whitespace-pre-wrap">
        {resultText
            ? resultText.split('\n').map((line, index) => {
                    let formattedLine = line;
                    const replacements = [
                        { regex: /###/g, replacement: '\n' }, // Replace top-level headings
                        { regex: /####/g, replacement: '\n' }, // Replace subheadings
                        { regex: /\\/g, replacement: '' }, // Remove bold markers
                        { regex: /\*/g, replacement: '' }, // Remove italic markers
                        {
                          regex: /\\frac{(\d+)}{(\d+)}/g,
                          replacement: (_: string, num: string, denom: string) => `${num}/${denom}`, // Convert fractions
                        },
                        { regex: /\\approx/g, replacement: '≈' }, // Replace approximation symbol
                        { regex: /\\pm/g, replacement: '±' }, // Replace plus-minus symbol
                        { regex: /\\leq/g, replacement: '<=' }, // Replace less than or equal symbol
                        { regex: /\\geq/g, replacement: '>=' }, // Replace greater than or equal symbol
                        { regex: /\\infty/g, replacement: '∞' }, // Replace infinity symbol
                        {
                          regex: /\\sqrt{(\d+)}/g,
                          replacement: (_: string, value: string) => `√${value}`, // Replace square root
                        },
                        { regex: /\\times/g, replacement: '×' }, // Replace multiplication symbol
                        { regex: /\\n/g, replacement: '\n' }, // Replace escaped newlines
                    ];

                    replacements.forEach(({ regex, replacement }) => {
                        if (typeof replacement === 'string') {
                            formattedLine = formattedLine.replace(regex, replacement);
                        } else {
                            formattedLine = formattedLine.replace(regex, replacement as (substring: string, ...args: string[]) => string);
                        }
                    });

                    return <div key={index}>{formattedLine.replace(/\*+/g, '')} </div>;
                })
            : null}
    </pre>


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

      {/* Render pie charts in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pieData.map(({ category, data }, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow">
            <h4 className="text-lg font-medium text-slate-800 mb-2">{category} </h4>
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
    </div>
  );
}