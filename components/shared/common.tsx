import React from 'react';

export const AiLoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <span className="text-gray-400 text-sm">{text}</span>
    </div>
);

export const renderFormattedText = (text: string): React.ReactNode[] => {
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
        const line = lines[i];
        if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={i} className="text-lg font-semibold text-brand-accent mt-4 mb-2">{line.replace('### ', '')}</h3>);
        } else if (line.match(/^(\*\*|)\d+\.\s/)) { // Matches "1. ", "**1. "** etc.
            flushList();
            elements.push(<h4 key={i} className="text-md font-semibold text-white mt-3 mb-1">{parseLineForBold(line)}</h4>);
        } else if (line.trim().startsWith('- ')) {
            listItems.push(<li key={i}>{parseLineForBold(line.replace('- ', ''))}</li>);
        } else if (line.trim() !== '') {
            flushList();
            elements.push(<p key={i} className="my-1 text-gray-300">{parseLineForBold(line)}</p>);
        }
    }
    flushList(); 
    return elements;
};
