"use client"

import {
  Portal,
  Spinner,
  Stack,
  Toast,
  createToastFn,
  ToastProvider,
} from "@chakra-ui/react"

export const toaster = createToastFn("ltr")
export const Toaster = () => {
  return (
    <Portal>
      <ToastProvider>
        {/* Toasts will be rendered automatically by ToastProvider */}
      </ToastProvider>
    </Portal>
  )

}
