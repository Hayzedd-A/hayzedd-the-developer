"use client"
import { useTheme } from "../context/ThemeContext";
import PageTransition from "./common/PageTransition";

export default function MainWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen } = useTheme();
                    
  return <main className={`w-full float-end`}><PageTransition>{children}</PageTransition></main>;
}
