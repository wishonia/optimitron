"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { ROUTES } from "@/lib/routes";

const SCREENSHOTS = [
  "/images/demo-preview/pl-intro.png",
  "/images/demo-preview/pl-moronia.png",
  "/images/demo-preview/pl-treaty.png",
  "/images/demo-preview/pl-game.png",
  "/images/demo-preview/pl-lives.png",
  "/images/demo-preview/pl-close.png",
];

export function DemoPreview() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % SCREENSHOTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionContainer bgColor="foreground" borderPosition="top" padding="lg">
      <Container>
        <SectionHeader
          title="See It In Action"
          subtitle="A guided tour narrated by an alien who has been running a planet for 4,237 years."
          size="lg"
        />
        <Link
          href={ROUTES.demo}
          className="block relative mx-auto max-w-4xl border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden aspect-video bg-black"
        >
          {SCREENSHOTS.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`Demo slide ${i + 1}`}
              fill
              className={`object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 896px) 100vw, 896px"
              priority={i === 0}
            />
          ))}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
            <div className="w-20 h-20 bg-brutal-pink border-4 border-primary rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl ml-1">▶</span>
            </div>
          </div>
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {SCREENSHOTS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-brutal-pink w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </Link>
      </Container>
    </SectionContainer>
  );
}
