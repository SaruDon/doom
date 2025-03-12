"use client";

import { sidebarLink } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky l-0 top-0 flex h-screen w-fit flex-col justify-between bg-[#1C1F2E] p-6 pt-28 text-white max-sm:hidden lg:w-[264]">
      <div className="flex flex-col gap--6">
        {sidebarLink.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(link.route);
          return (
            <>
              <Link
                href={link.route}
                key={link.label}
                className={cn(
                  "flex -gap-4 items-center p-4 rounded-lg justify-start",
                  isActive && "bg[#4c73ff]"
                )}
              >
                {link.label}
              </Link>
            </>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
