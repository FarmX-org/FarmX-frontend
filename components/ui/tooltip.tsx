import { Tooltip as ChakraTooltip, Portal, TooltipProps as ChakraTooltipProps } from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps extends Omit<ChakraTooltipProps, "content"> {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: any // Replace 'any' with a custom type if you need stricter typing
  disabled?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    if (disabled) return children

    if (portalled) {
      return (
        <Portal containerRef={portalRef}>
          <ChakraTooltip
            ref={ref}
            label={content}
            hasArrow={showArrow}
            {...contentProps}
            {...rest}
          >
            {children}
          </ChakraTooltip>
        </Portal>
      )
    }

    return (
      <ChakraTooltip
        ref={ref}
        label={content}
        hasArrow={showArrow}
        {...contentProps}
        {...rest}
      >
        {children}
      </ChakraTooltip>
    )
  },
)
