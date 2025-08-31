
import React, { useState } from 'react';
import { generateMenuItemDescription, analyzeSalesData } from '../services/geminiService';
import { mockMenuItems, mockSales } from '../services/mockData';
import { MenuItem } from '../types';

const AiToolCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-base-100 p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 mt-1 mb-6">{description}</p>
    <div>{children}</div>
  </div>
);

const MenuDescGenerator: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!selectedItem) return;
        setIsLoading(true);
        setDescription('');
        const desc = await generateMenuItemDescription(selectedItem.name, selectedItem.category);
        setDescription(desc);
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <select
                onChange={(e) => setSelectedItem(mockMenuItems.find(item => item.id === parseInt(e.target.value)) || null)}
                className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary"
            >
                <option>Select a menu item...</option>
                {mockMenuItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <button onClick={handleGenerate} disabled={!selectedItem || isLoading} className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isLoading ? 'Generating...' : '✨ Generate Description'}
            </button>
            {isLoading && <div className="text-center p-4">Generating with Gemini...</div>}
            {description && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
                    <p className="text-white">{description}</p>
                </div>
            )}
        </div>
    );
};

const SalesAnalyst: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setAnalysis('');
        const result = await analyzeSalesData(mockSales, question);
        setAnalysis(result);
        setIsLoading(false);
    };

    return (
         <div className="space-y-4">
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What was our best-selling main course? or Any sales trends last week?"
                className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary h-24"
            />
            <button onClick={handleAnalyze} disabled={!question.trim() || isLoading} className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isLoading ? 'Analyzing...' : '🧠 Ask AI Analyst'}
            </button>
            {isLoading && <div className="text-center p-4">Analyzing with Gemini...</div>}
            {analysis && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
                    <p className="text-white whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    );
};


export const AiTools: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AiToolCard title="Menu Description Generator" description="Automatically create appealing descriptions for your menu items using generative AI.">
        <MenuDescGenerator />
      </AiToolCard>
      <AiToolCard title="Sales Data Analyst" description="Ask questions about your sales in plain English and get instant insights from our AI analyst.">
        <SalesAnalyst />
      </AiToolCard>
    </div>
  );
};
