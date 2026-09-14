"use client";

import * as React from "react";
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import { Button } from "@/components/ui/button";

export interface ToastOptions {
  id?: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actionProps?: {
    children: React.ReactNode;
    onClick: () => void;
  };
  duration?: number;
}

type ToastFunction = {
  (message: React.ReactNode, data?: any): string | number;
  add: (options: ToastOptions) => string | number;
  close: (id?: string | number) => void;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    data: {
      loading: React.ReactNode;
      success: React.ReactNode | ((data: T) => React.ReactNode);
      error: React.ReactNode | ((error: any) => React.ReactNode);
    }
  ) => any;
  success: (message: React.ReactNode, data?: any) => string | number;
  error: (message: React.ReactNode, data?: any) => string | number;
  info: (message: React.ReactNode, data?: any) => string | number;
  warning: (message: React.ReactNode, data?: any) => string | number;
  dismiss: (id?: string | number) => void;
};

const toastImpl: any = (message: React.ReactNode, data?: any) => {
  return sonnerToast(message as any, data);
};

toastImpl.add = function (options: ToastOptions): string | number {
  const toastId = options.id || Math.random().toString(36).substring(2, 9);
  sonnerToast(options.title as any, {
    id: toastId,
    description: options.description as any,
    action: options.actionProps
      ? {
          label: options.actionProps.children as any,
          onClick: options.actionProps.onClick,
        }
      : undefined,
    duration: options.duration || 4000,
  });
  return toastId;
};

toastImpl.close = function (id?: string | number) {
  sonnerToast.dismiss(id);
};

toastImpl.dismiss = function (id?: string | number) {
  sonnerToast.dismiss(id);
};

toastImpl.promise = function <T>(
  promise: Promise<T> | (() => Promise<T>),
  data: {
    loading: React.ReactNode;
    success: React.ReactNode | ((data: T) => React.ReactNode);
    error: React.ReactNode | ((error: any) => React.ReactNode);
  }
) {
  return sonnerToast.promise(promise as any, data as any);
};

toastImpl.success = sonnerToast.success;
toastImpl.error = sonnerToast.error;
toastImpl.info = sonnerToast.info;
toastImpl.warning = sonnerToast.warning;

export const toast: ToastFunction = toastImpl;

export function ToastDemo() {
  function showToast() {
    const id = toast.add({
      title: "Event created",
      description: "Sunday, December 3 at 9:00 AM",
      actionProps: {
        children: "Undo",
        onClick() {
          toast.close(id);
        },
      },
    });
  }

  return (
    <Button variant="outline" onClick={showToast}>
      Show Toast
    </Button>
  );
}

export function ToastPromise() {
  function showToast() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: "Event" }), 2000);
      }),
      {
        loading: "Creating event…",
        success: (data) => `${data.name} created.`,
        error: "Could not create event.",
      }
    );
  }

  return (
    <Button variant="outline" onClick={showToast}>
      Create Event
    </Button>
  );
}

export { SonnerToaster as Toaster };
