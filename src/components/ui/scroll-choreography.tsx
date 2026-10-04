"use client";

/**
 * ScrollChoreography (21st.dev), adaptado:
 * - tamaños y desplazamientos distintos en celular para que las fotos no queden diminutas
 * - `overlay`: contenido que aparece sobre la foto principal cuando ya llenó la pantalla
 * - textos alternativos reales y respeto a "reducir movimiento" (se muestra una cuadrícula fija)
 */

import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ChoreoImage {
  src: string;
  alt: string;
}

interface ScrollChoreographyProps {
  className?: string;
  images: {
    topLeft: ChoreoImage;
    topRight: ChoreoImage;
    bottomLeft: ChoreoImage;
    bottomRight: ChoreoImage;
  };
  overlay?: ReactNode;
}

export function ScrollChoreography({ className, images, overlay }: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px)");
  // en pantallas táctiles: sin resorte (va pegado al dedo) y solo transformaciones de GPU
  const touch = useMediaQuery("(hover: none), (pointer: coarse)");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
  });

  const wN = mobile ? 44 : 34;
  const hN = mobile ? 21 : 28;
  const w = `${wN}vw`;
  const h = `${hN}vh`;
  const progress: MotionValue<number> = touch ? scrollYProgress : smoothProgress;

  const xLeft = mobile ? "-23vw" : "-18.5vw";
  const xRight = mobile ? "23vw" : "18.5vw";
  const yTop = mobile ? "-11.5vh" : "-15vh";
  const yBottom = mobile ? "11.5vh" : "15vh";

  // Fase 1: 0 - 0.3 (movimiento en diagonal)
  // Fase 2: 0.35 - 0.65 (se apilan al centro)
  // Fase 3: 0.7 - 0.9 (la de arriba a la derecha llena la pantalla)
  const tlX = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [yTop, yBottom, yBottom, "0vh", "0vh"]);

  const brX = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yTop, yTop, "0vh", "0vh"]);

  const blX = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yBottom, yBottom, "0vh", "0vh"]);

  const trX = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(progress, [0, 0.3, 0.35, 0.65, 1], [yTop, yTop, yTop, "0vh", "0vh"]);

  const heroWidth = useTransform(progress, [0.65, 0.7, 0.9, 1], [w, w, "100vw", "100vw"]);
  const heroHeight = useTransform(progress, [0.65, 0.7, 0.9, 1], [h, h, "100vh", "100vh"]);
  const heroRadius = useTransform(progress, [0.7, 0.9], [14, 0]);
  // versión táctil: la foto mide siempre la pantalla y se escala; adentro se des-escala para no deformarse
  const heroSX = useTransform(progress, [0.65, 0.7, 0.9, 1], [wN / 100, wN / 100, 1, 1]);
  const heroSY = useTransform(progress, [0.65, 0.7, 0.9, 1], [hN / 100, hN / 100, 1, 1]);
  const innerSX = useTransform(heroSX, (v) => 1 / v);
  const innerSY = useTransform(heroSY, (v) => 1 / v);

  const underImagesOpacity = useTransform(progress, [0.75, 0.85], [1, 0]);
  const overlayOpacity = useTransform(progress, [0.86, 0.96], [0, 1]);
  const overlayY = useTransform(progress, [0.86, 0.96], [24, 0]);

  if (reduce) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="grid grid-cols-2 gap-3 px-4 md:px-10">
          {[images.topLeft, images.topRight, images.bottomLeft, images.bottomRight].map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          ))}
        </div>
        {overlay && <div className="relative mt-8 px-4 md:px-10">{overlay}</div>}
      </div>
    );
  }

  const baseImageClasses =
    "absolute left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-blush shadow-[0_30px_60px_-20px_rgba(60,20,30,0.35)] will-change-transform max-md:shadow-lg";

  return (
    <div ref={containerRef} className={cn("relative h-[260vh] w-full", className)}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div style={{ x: tlX, y: tlY, width: w, height: h, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-10")}>
            <img src={images.topLeft.src} alt={images.topLeft.alt} loading="lazy" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div style={{ x: brX, y: brY, width: w, height: h, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-20")}>
            <img src={images.bottomRight.src} alt={images.bottomRight.alt} loading="lazy" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div style={{ x: blX, y: blY, width: w, height: h, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-30")}>
            <img src={images.bottomLeft.src} alt={images.bottomLeft.alt} loading="lazy" className="h-full w-full object-cover" />
          </motion.div>

          {/* la principal: termina llenando la pantalla */}
          {touch ? (
            <motion.div
              style={{ x: trX, y: trY, width: "100vw", height: "100vh", scaleX: heroSX, scaleY: heroSY }}
              className={cn(baseImageClasses, "z-40 origin-center rounded-none shadow-none")}
            >
              <motion.div style={{ scaleX: innerSX, scaleY: innerSY }} className="absolute inset-0 origin-center will-change-transform">
                <img src={images.topRight.src} alt={images.topRight.alt} loading="lazy" className="h-full w-full object-cover" />
                {overlay && (
                  <motion.div
                    style={{ opacity: overlayOpacity, y: overlayY }}
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
                  >
                    {overlay}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              style={{ x: trX, y: trY, width: heroWidth, height: heroHeight, borderRadius: heroRadius }}
              className={cn(baseImageClasses, "z-40 origin-center")}
            >
              <img src={images.topRight.src} alt={images.topRight.alt} loading="lazy" className="h-full w-full object-cover" />
              {overlay && (
                <motion.div
                  style={{ opacity: overlayOpacity, y: overlayY }}
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
                >
                  {overlay}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScrollChoreography;
