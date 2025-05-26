"use client";

import React, { Suspense } from "react";
import Loading from "./loadingSpinner";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback = <Loading />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseWrapper;
