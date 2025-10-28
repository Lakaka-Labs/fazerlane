"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to a monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Something went wrong.</h2>
          <p className="text-gray-500">{this.state.error?.message}</p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
