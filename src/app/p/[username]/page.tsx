import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Mail, 
  Globe, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Award, 
  Code2, 
  User, 
  Send,
  Sparkles,
  ChevronRight,
  Layers,
  CheckCircle2
} from "lucide-react";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const username = (await params).username;
  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
  });

  if (!portfolio) {
    return { title: "Portfolio Not Found | Charvia" };
  }

  const name = portfolio.username;
  const title = portfolio.seoTitle || `${name}'s Professional Portfolio`;
  const description = portfolio.seoDescription || `Explore the projects, skills, and experience of ${name}.`;

  return {
    title: `${title} | Charvia`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PortfolioPageProps) {
  const username = (await params).username;
  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
    include: {
      sections: {
        where: { isHidden: false },
        orderBy: { order: "asc" },
      },
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!portfolio) {
    notFound();
  }

  if (!portfolio.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 font-sans">
        <div className="text-center space-y-4 max-w-md p-8 rounded-3xl border border-zinc-800 bg-zinc-950">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <LockIcon />
          </div>
          <h1 className="text-2xl font-bold font-sora">Portfolio is Private</h1>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            This portfolio is currently in draft mode and has not been published by the owner.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const primaryColor = portfolio.colorHex || "#4F46E5";
  const fullName = `${portfolio.user.firstName || ""} ${portfolio.user.lastName || ""}`.trim() || portfolio.username;

  return (
    <div
      className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden"
      style={{
        "--theme-color": primaryColor,
        fontFamily: portfolio.fontFamily || "inherit",
      } as React.CSSProperties}
    >
      {/* Background Micro Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Floating Glass Header Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 p-4">
        <div className="max-w-5xl mx-auto backdrop-blur-xl bg-zinc-950/80 border border-zinc-800/80 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
          <Link href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
              {fullName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            {portfolio.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.type}`}
                className="hover:text-white transition-colors capitalize"
              >
                {sec.type}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30"
          >
            Get In Touch
          </a>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-32 relative z-10">
        {portfolio.sections.map((section) => {
          const content = (section.content || {}) as any;

          return (
            <section key={section.id} id={section.type} className="space-y-12">
              
              {/* SECTION: HERO */}
              {section.type === "hero" && (
                <div className="py-16 space-y-8 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>WELCOME TO MY PORTFOLIO</span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
                    {content.title || fullName}
                  </h1>

                  <p className="text-xl sm:text-2xl text-indigo-300 font-medium">
                    {content.subtitle || "Full Stack Developer & AI Specialist"}
                  </p>

                  <p className="text-zinc-400 text-base font-light leading-relaxed max-w-2xl">
                    {content.bio || content.description || "Building modern high-performance web products, intuitive UI systems, and intelligent digital applications."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <a
                      href="#projects"
                      className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                    >
                      <span>Explore Projects</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>

                    <a
                      href="#contact"
                      className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-medium transition-all"
                    >
                      Contact Me
                    </a>
                  </div>
                </div>
              )}

              {/* SECTION: ABOUT */}
              {section.type === "about" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <User className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">About Me</h2>
                  </div>

                  <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 text-zinc-300 text-base leading-relaxed font-light space-y-4">
                    <p>{content.text || content.bio || content.description || "I am a dedicated software engineer focused on building elegant, reliable, and accessible applications."}</p>
                  </div>
                </div>
              )}

              {/* SECTION: SKILLS */}
              {section.type === "skills" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Code2 className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">Skills & Technologies</h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {Array.isArray(content.skills) ? (
                      content.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-xs hover:border-indigo-500/50 transition-colors"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      ["Next.js", "TypeScript", "Tailwind CSS", "React", "Node.js", "PostgreSQL", "Python", "Prisma"].map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-xs"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: PROJECTS */}
              {section.type === "projects" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Layers className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(content.items) && content.items.length > 0 ? (
                      content.items.map((proj: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 space-y-4 hover:border-indigo-500/50 transition-all group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {proj.title}
                            </h3>
                            <p className="text-sm text-zinc-400 font-light leading-relaxed">
                              {proj.description}
                            </p>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-zinc-900">
                            {Array.isArray(proj.techStack) && (
                              <div className="flex flex-wrap gap-1.5">
                                {proj.techStack.map((tech: string) => (
                                  <span key={tech} className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[11px] font-mono text-zinc-400 border border-zinc-800">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-xs font-mono">
                              {proj.link && (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                  <span>Live Demo</span> <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {proj.github && (
                                <a href={proj.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                                  <span>GitHub</span> <GithubIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 text-center text-zinc-400">
                        No projects configured yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: EXPERIENCE */}
              {section.type === "experience" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Briefcase className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">Work Experience</h2>
                  </div>

                  <div className="space-y-6">
                    {Array.isArray(content.items) && content.items.length > 0 ? (
                      content.items.map((exp: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-900 pb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                              <div className="text-sm font-mono text-indigo-400">{exp.company}</div>
                            </div>
                            <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
                          </div>
                          <p className="text-sm text-zinc-400 font-light leading-relaxed">{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 text-center text-zinc-400">
                        No experience items listed.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: EDUCATION */}
              {section.type === "education" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">Education</h2>
                  </div>

                  <div className="space-y-4">
                    {Array.isArray(content.items) && content.items.length > 0 ? (
                      content.items.map((edu: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 space-y-2">
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                            <span className="text-xs font-mono text-zinc-500">{edu.period}</span>
                          </div>
                          <div className="text-sm font-mono text-indigo-400">{edu.institution}</div>
                          {edu.description && <p className="text-sm text-zinc-400 font-light">{edu.description}</p>}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 text-center text-zinc-400">
                        No education items listed.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: ACHIEVEMENTS & CERTIFICATIONS */}
              {(section.type === "achievements" || section.type === "certifications") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    {section.type === "achievements" ? <Trophy className="w-6 h-6 text-indigo-400" /> : <Award className="w-6 h-6 text-indigo-400" />}
                    <h2 className="text-3xl font-bold text-white capitalize">{section.type}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(content.items) ? (
                      content.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="text-sm text-zinc-200 font-medium">
                            {typeof item === "string" ? item : item.title || item.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-8 rounded-3xl border border-zinc-800 bg-zinc-950/60 text-center text-zinc-400">
                        No items configured.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: CONTACT */}
              {section.type === "contact" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Mail className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-3xl font-bold text-white">Get In Touch</h2>
                  </div>

                  <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/80 space-y-6 max-w-2xl">
                    <p className="text-zinc-300 text-sm font-light">
                      Interested in collaborating or discussing an upcoming project? Send a direct email or message.
                    </p>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Mail className="w-4 h-4 text-indigo-400" />
                        <span>{portfolio.user.email}</span>
                      </div>
                    </div>

                    <a
                      href={`mailto:${portfolio.user.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
                    >
                      <span>Send Direct Email</span>
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 text-center text-xs text-zinc-500 font-mono space-y-2">
        <div>© {new Date().getFullYear()} {fullName}. All rights reserved.</div>
        <div>
          Powered by <Link href="/" className="text-indigo-400 font-bold hover:underline">Charvia</Link>
        </div>
      </footer>
    </div>
  );
}

function LockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
