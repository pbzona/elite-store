import * as LucideIcons from "lucide-react"
import type { LucideProps } from "lucide-react"

type IconName = keyof typeof LucideIcons

interface IconProps extends Omit<LucideProps, "ref"> {
  name?: string | null
}

export function Icon({ name, ...props }: IconProps) {
  if (!name) return null

  const IconComponent = LucideIcons[name as IconName] as React.ComponentType<LucideProps>

  if (!IconComponent) {
    // Fallback to Package icon if the specified icon doesn't exist
    const FallbackIcon = LucideIcons.Package
    return <FallbackIcon {...props} />
  }

  return <IconComponent {...props} />
}
