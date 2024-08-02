import { Icons } from '@astrojs/starlight/icons'
import clsx from 'clsx'

export interface IconProps {
  name: keyof typeof Icons
  label?: string
  color?: string
  size?: string
  class?: string
}

export function Icon(props: IconProps) {
  const { name, label, size = '1em', color } = props
  const a11yAttrs = label
    ? ({ 'aria-label': label } as const)
    : ({ 'aria-hidden': 'true' } as const)

  return (
    <svg
      {...a11yAttrs}
      class={clsx([props.class, 'w-1em h-1em'])}
      style={{ fontSize: size, color }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      dangerouslySetInnerHTML={{ __html: Icons[name] }}
    />
  )
}
