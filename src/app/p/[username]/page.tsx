import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const username = (await params).username;
  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
  });

  if (!portfolio) {
    return { title: "Portfolio Not Found" };
  }

  return {
    title: portfolio.seoTitle || `${portfolio.username}'s Portfolio`,
    description: portfolio.seoDescription || `Welcome to the professional portfolio of ${portfolio.username}.`,
    themeColor: portfolio.colorHex,
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
      }
    },
  });

  if (!portfolio) {
    notFound();
  }

  if (!portfolio.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Portfolio is Private</h1>
          <p className="text-muted-foreground">This portfolio is currently not published.</p>
        </div>
      </div>
    );
  }

  // Very basic minimal theme renderer
  // In a real app, you would load different theme components based on portfolio.theme
  return (
    <div 
      className="min-h-screen font-sans" 
      style={{ 
        '--theme-color': portfolio.colorHex,
        fontFamily: portfolio.fontFamily 
      } as React.CSSProperties}
    >
      {/* Dynamic Sections Renderer */}
      <main className="max-w-4xl mx-auto p-8 space-y-24 py-24">
        {portfolio.sections.map((section) => (
          <section key={section.id} id={section.type} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {section.type === 'hero' && (
              <div className="text-center space-y-4 py-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--theme-color)]">
                  {(section.content as any)?.title || `${portfolio.user.firstName} ${portfolio.user.lastName}`}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  {(section.content as any)?.subtitle || "Building digital experiences"}
                </p>
              </div>
            )}
            
            {section.type === 'about' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold border-b pb-2">About Me</h2>
                <div className="text-lg leading-relaxed text-muted-foreground">
                  {(section.content as any)?.text || "I am a professional with a passion for excellence."}
                </div>
              </div>
            )}

            {/* Other sections would go here (skills, experience, projects) */}
            {section.type !== 'hero' && section.type !== 'about' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold border-b pb-2 capitalize">{section.type}</h2>
                <div className="p-6 bg-muted/30 rounded-lg border border-dashed">
                  <p className="text-muted-foreground text-center">
                    {section.type} content goes here (configured from JSON).
                  </p>
                </div>
              </div>
            )}
          </section>
        ))}
      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground border-t">
        Powered by <a href="/" className="font-semibold text-primary hover:underline">Charvia</a>
      </footer>
    </div>
  );
}
