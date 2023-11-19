"use client";

import { cn } from "@/lib/utils";
import { PiTreeEvergreenBold } from "react-icons/pi";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxDashboard } from "react-icons/rx";


const links = [
    {
        name: "Tents & trees",
        href: "/tents_and_trees",
        icon: PiTreeEvergreenBold,
    },
    {
        name: "Game of life",
        href: "/game_of_life",
        icon: RxDashboard,
    },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Games
                    </h2>
                    <div className="space-y-2">
                        <SidebarButtons />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SidebarButtons() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-3 w-full justify-start",
                            {
                                "bg-secondary/60": pathname === link.href,
                            }
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
