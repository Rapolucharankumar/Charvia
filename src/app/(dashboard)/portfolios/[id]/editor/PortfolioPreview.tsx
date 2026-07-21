"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function PortfolioPreview({ portfolio, sections }: { portfolio: any, sections: any[] }) {
  const visibleSections = sections.filter((s: any) => !s.isHidden).sort((a, b) => a.order - b.order);

  const getThemeClasses = () => {
    switch (portfolio.theme) {
      case "developer": return "bg-slate-950 text-slate-300 font-mono";
      case "creative": return "bg-orange-50 text-slate-800";
      case "cyberpunk": return "bg-black text-cyan-400 font-sans tracking-tight";
      case "minimal":
      default: return "bg-white text-slate-900 font-sans";
    }
  };

  const getAccentStyle = () => {
    if (portfolio.theme === 'cyberpunk') {
      return { color: portfolio.colorHex, textShadow: `0 0 10px ${portfolio.colorHex}, 0 0 20px ${portfolio.colorHex}` };
    }
    return { color: portfolio.colorHex };
  };

  const getBgAccent = () => {
    if (portfolio.theme === 'cyberpunk') {
      return { backgroundColor: portfolio.colorHex, boxShadow: `0 0 15px ${portfolio.colorHex}` };
    }
    return { backgroundColor: portfolio.colorHex };
  };

  return (
    <div className={`w-full min-h-full transition-colors duration-500 ${getThemeClasses()}`}>
      <div className="flex flex-col">
        {visibleSections.map(section => (
          <SectionRenderer 
            key={section.id} 
            section={section} 
            theme={portfolio.theme}
            getAccentStyle={getAccentStyle}
            getBgAccent={getBgAccent}
            colorHex={portfolio.colorHex}
          />
        ))}
      </div>
    </div>
  );
}

function SectionRenderer({ section, theme, getAccentStyle, getBgAccent, colorHex }: any) {
  const content = section.content || {};

  switch (section.type) {
    case 'hero':
      return (
        <section className={`min-h-[70vh] flex flex-col justify-center px-8 md:px-24 py-20 ${theme === 'cyberpunk' ? 'border-b border-cyan-900/50' : ''}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={theme === 'cyberpunk' || theme === 'creative' ? getAccentStyle() : {}}>
              {content.title || "Your Name"}
            </h1>
            <p className={`text-xl md:text-2xl max-w-2xl leading-relaxed ${theme === 'developer' ? 'text-slate-400' : 'text-slate-600'} ${theme === 'cyberpunk' ? 'text-cyan-600' : ''}`}>
              {content.subtitle || "I am a professional."}
            </p>
            <div className="mt-10 flex gap-4">
               <a href="#contact" className="px-8 py-3 rounded-full font-medium transition-all" style={getBgAccent()} >
                 <span className={theme === 'developer' || theme === 'cyberpunk' ? 'text-black' : 'text-white'}>Get In Touch</span>
               </a>
            </div>
          </motion.div>
        </section>
      );
    case 'about':
      return (
        <section className={`px-8 md:px-24 py-24 ${theme === 'minimal' ? 'bg-slate-50' : theme === 'developer' ? 'bg-slate-900/50' : theme === 'cyberpunk' ? 'border-b border-cyan-900/50' : 'bg-white'}`}>
          <div className="max-w-4xl">
             <h2 className="text-sm font-bold uppercase tracking-widest mb-8" style={getAccentStyle()}>About</h2>
             <p className={`text-2xl md:text-4xl leading-snug font-medium ${theme === 'developer' ? 'text-slate-300' : theme === 'cyberpunk' ? 'text-cyan-200' : 'text-slate-800'}`}>
               {content.text || "This is the about section."}
             </p>
          </div>
        </section>
      );
    case 'skills':
      const categories = content.skills || [];
      return (
        <section className="px-8 md:px-24 py-24">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-12" style={getAccentStyle()}>Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {categories.map((cat: any, i: number) => (
              <div key={i} className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-4" style={{ borderColor: `${colorHex}40` }}>{cat.category || 'Category'}</h3>
                <ul className="space-y-3">
                  {(cat.items || []).map((item: string, j: number) => (
                    <li key={j} className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full" style={getBgAccent()} />
                       <span className={theme === 'developer' ? 'text-slate-400' : theme === 'cyberpunk' ? 'text-cyan-600' : 'text-slate-600'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    case 'experience':
      const jobs = content.jobs || [];
      return (
        <section className={`px-8 md:px-24 py-24 ${theme === 'minimal' ? 'bg-slate-50' : theme === 'developer' ? 'bg-slate-900/50' : theme === 'cyberpunk' ? 'border-b border-cyan-900/50' : 'bg-white'}`}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-16" style={getAccentStyle()}>Experience</h2>
          <div className="space-y-16 max-w-4xl">
            {jobs.map((job: any, i: number) => (
              <div key={i} className="relative pl-8 md:pl-0">
                 <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-border" style={{ backgroundColor: `${colorHex}30` }} />
                 <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                    <div className="md:w-1/4 shrink-0">
                      <div className="text-sm font-bold tracking-wider" style={getAccentStyle()}>{job.duration || "Duration"}</div>
                      <div className={`mt-2 font-medium ${theme === 'developer' ? 'text-slate-300' : theme === 'cyberpunk' ? 'text-cyan-400' : 'text-slate-900'}`}>{job.company || "Company"}</div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-2xl font-bold mb-4">{job.role || "Role"}</h3>
                      <ul className="space-y-3">
                        {(job.highlights || []).map((hl: string, j: number) => (
                          <li key={j} className={`leading-relaxed ${theme === 'developer' ? 'text-slate-400' : theme === 'cyberpunk' ? 'text-cyan-700' : 'text-slate-600'}`}>
                            • {hl}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'projects':
      const projects = content.projects || [];
      return (
        <section className="px-8 md:px-24 py-24">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-12" style={getAccentStyle()}>Selected Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj: any, i: number) => (
              <div key={i} className={`group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${theme === 'minimal' ? 'bg-slate-50 hover:bg-slate-100' : theme === 'developer' ? 'bg-slate-900/50 hover:bg-slate-900' : theme === 'cyberpunk' ? 'border border-cyan-900/50 hover:border-cyan-400' : 'bg-white shadow-xl shadow-orange-900/5 border border-orange-900/10'}`}>
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${colorHex}, #9333ea)` }}>{proj.name || "Project Name"}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                 </div>
                 <p className={`mb-8 leading-relaxed ${theme === 'developer' ? 'text-slate-400' : theme === 'cyberpunk' ? 'text-cyan-700' : 'text-slate-600'}`}>
                   {proj.description || "Description"}
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {(proj.technologies || []).map((tech: string, j: number) => (
                     <span key={j} className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${colorHex}15`, color: colorHex }}>
                       {tech}
                     </span>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </section>
      );
    default:
      return null;
  }
}
