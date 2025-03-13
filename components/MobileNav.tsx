"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sidebarLink } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathName = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="nav-small"
            width={36}
            height={36}
            className="cursor pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-[#1C1F2E]">
          <SheetTitle className="p-2 mt-4">
            <Link href={``} className="flex items-center gap-1">
              <Image
                src="/icons/logo.svg"
                width={32}
                height={32}
                alt="Doom Logo"
                className="max-sm:size-10"
              />
              <p className="text-[26px] font-extrabold text-white">Doom</p>
            </Link>
          </SheetTitle>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-10 text-white">
                {sidebarLink.map((link) => {
                  const isActive =
                    link.label === "Home"
                      ? pathName === link.route
                      : pathName === link.route ||
                        pathName.startsWith(link.route);
                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        href={link.route}
                        key={link.label}
                        className={cn(
                          "flex gap-4 items-center p-4 rounded-lg ml-2 w-full max-w-60",
                          {
                            "bg-[#0e78f9]": isActive,
                          }
                        )}
                      >
                        <Image
                          src={link.imageUrl}
                          alt={link.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
