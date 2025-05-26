"use client";

import Image from "next/image";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";
import WelcomePage from "./components/WelcomePage";

export default function Home() {
  return (
    <div>

    <WelcomePage/>
    </div>
  );
}

{/* <Sidebar /> */}
// <ThemeProvider>
// </ThemeProvider>