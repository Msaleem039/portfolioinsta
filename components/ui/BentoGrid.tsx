"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import GridGlobe from "./GridGlobe"; // Adjust the path based on where GridGlobe is located

import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./GradientBg";
import animationData from "@/data/confetti.json";

// Dynamically import Lottie with SSR disabled
// const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState(false);

  // Special configurations for BentoGridItem
  const specialConfigs = {
    6: {
      showGradient: true,
      lottieOptions: {
        loop: copied,
        autoplay: copied,
        animationData: animationData || {}, // Fallback in case animationData is missing
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      },
    },
    5: { spareImgOpacity: "opacity-80" },
  };

  const config = specialConfigs[id] || {};

  const handleCopy = () => {
    const text = "hsu@jsmastery.pro";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
    >
      {/* Background gradient and image */}
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-5 ${config.spareImgOpacity || ""}`}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
        {config.showGradient && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        {/* Content */}
        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10 text-white">
            {title}
          </div>
          <div
            className="font-sans font-extralight md:max-w-60 md:text-xs lg:text-base text-sm text-white z-10"
            style={{ color: "white", fontWeight: "400", textAlign: "justify" }}
          >
            {description}
          </div>

          {id === 2 && <GridGlobe />}

          {/* Display Lottie Animation for id 6 */}
          {id === 6 && (
            <div className="mt-5 relative">
              <div className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"}`}>
                {/* <Lottie options={config.lottieOptions} height={200} width={400} /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
