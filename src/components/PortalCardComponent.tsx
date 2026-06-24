/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, FileText, Link, Database, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { PortalCard } from '../data/mecPortalData';

interface PortalCardComponentProps {
  key?: React.Key | null | undefined;
  card: PortalCard;
  darkMode: boolean;
}

export default function PortalCardComponent({ card, darkMode }: PortalCardComponentProps) {
  // Determine badge colors based on document types
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'PDF':
        return darkMode
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          : 'bg-rose-50 text-rose-600 border-rose-200';
      case 'FORM':
        return darkMode
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : 'bg-amber-50 text-amber-600 border-amber-200';
      case 'DRIVE':
        return darkMode
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'LINK':
        return darkMode
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
          : 'bg-sky-50 text-sky-600 border-sky-200';
      default:
        return darkMode
          ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
          : 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4" />;
      case 'FORM':
        return <AlertTriangle className="w-4 h-4" />;
      case 'DRIVE':
        return <Database className="w-4 h-4" />;
      case 'LINK':
        return <Link className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block p-5 rounded-xl border transition-all duration-300 relative overflow-hidden h-full cursor-pointer ${
        darkMode
          ? 'bg-slate-900/60 border-slate-800 hover:border-orange-500/50 hover:bg-slate-900/90 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
          : 'bg-white border-slate-200 hover:border-orange-500/50 hover:bg-orange-50/10 hover:shadow-md'
      }`}
      id={`card-${card.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${
        darkMode ? 'from-orange-500/5 via-transparent to-transparent' : 'from-orange-500/3 via-transparent to-transparent'
      }`} />

      <div className="flex flex-col justify-between h-full relative z-10" id="card-content-wrapper">
        <div>
          {/* Badge & Type Icon */}
          <div className="flex items-center justify-between mb-4.5" id="card-top-row">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase rounded-md border tracking-wider ${getBadgeStyles(card.type)}`}>
              {getIconForType(card.type)}
              {card.type}
            </span>
            <div className={`p-1.5 rounded-lg border transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 group-hover:border-orange-500/40 group-hover:text-orange-400 text-slate-500' 
                : 'bg-slate-50 border-slate-200 group-hover:border-orange-500/30 group-hover:text-orange-500 text-slate-400'
            }`}>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-sans font-extrabold text-sm tracking-tight mb-2 group-hover:text-orange-500 transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {card.title}
          </h3>

          {/* Description */}
          <p className={`text-xs leading-relaxed mb-4 font-normal ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {card.description}
          </p>
        </div>

        {/* Bottom Interactive Prompt */}
        <div className="pt-3 border-t border-transparent group-hover:border-orange-500/10 flex items-center gap-1.5" id="card-bottom-row">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            darkMode ? 'text-slate-500 group-hover:text-orange-400' : 'text-slate-400 group-hover:text-orange-500'
          }`}>
            Open Document
          </span>
          <span className="text-orange-500 text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </a>
  );
}
