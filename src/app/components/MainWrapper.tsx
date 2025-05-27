"use client"

import PageTransition from "./common/PageTransition";

export default function MainWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
                    
  return <main className={`w-full float-end`}><PageTransition>{children}</PageTransition></main>;
}
