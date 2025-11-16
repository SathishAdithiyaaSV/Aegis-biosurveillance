import React from 'react';
import { InformationCircleIcon as OutlineInformationCircleIcon } from '@heroicons/react/24/outline';

export const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-brand-dark border border-brand-light-blue text-xs text-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            {text}
        </div>
    </div>
);

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <Tooltip text={text}>
        <OutlineInformationCircleIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
    </Tooltip>
);

export const AiLoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <span className="text-gray-400 text-sm">{text}</span>
    </div>
);

export const ComponentLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`h-full flex justify-center items-center text-center ${className}`}>
        <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-400">Loading Data...</p>
        </div>
    </div>
);

export const renderFormattedText = (text: string): React.ReactNode[] => {
    if (!text) {
        return [];
    }
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const parseLineForBold = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 text-gray-300">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={i} className="text-lg font-semibold text-brand-accent mt-4 mb-2">{line.replace('### ', '')}</h3>);
        } else if (line.match(/^(\*\*|)\d+\.\s/)) { // Matches "1. ", "**1. "** etc.
            flushList();
            elements.push(<h4 key={i} className="text-md font-semibold text-white mt-3 mb-1">{parseLineForBold(line)}</h4>);
        } else if (line.trim().startsWith('- ')) {
            listItems.push(<li key={i}>{parseLineForBold(line.replace('- ', ''))}</li>);
        } else if (line.startsWith('**') && line.includes('**:')) {
             flushList();
             const parts = line.split(/(\*\*.*?\**:)/);
             elements.push(
                <p key={i} className="my-1 text-gray-300">
                    <strong className="text-white">{parts[1].slice(2, -2)}:</strong>
                    {parts[2]}
                </p>
             )
        } else if (line.trim() !== '') {
            flushList();
            elements.push(<p key={i} className="my-1 text-gray-300">{parseLineForBold(line)}</p>);
        }
    }
    flushList(); 
    return elements;
};