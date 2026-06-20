"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  items: { title: string; href: string; icon: React.ElementType }[];
  title?: string;
}

export function MobileNav({ items, title = "Menu" }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="shrink-0 md:hidden flex items-center justify-center h-10 w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        <SheetDescription className="sr-only">Navigate the Charvia platform</SheetDescription>
        <div className="flex h-14 items-center border-b px-2 pb-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" alt="Charvia Logo" width={24} height={24} className="rounded-sm" />
            <span className="text-lg">Charvia</span>
          </Link>
        </div>
        <nav className="grid gap-2 text-lg font-medium pt-4">
          <div className="text-sm font-semibold text-muted-foreground pb-2">{title}</div>
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
