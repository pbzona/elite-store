import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  ChevronUp as ChevronUpIcon,
  Circle as CircleIcon,
  CreditCard as CreditCardIcon,
  Filter as FilterIcon,
  Folder as FolderIcon,
  Heart as HeartIcon,
  LogOut as LogOutIcon,
  MapPin as MapPinIcon,
  Menu as MenuIcon,
  Minus as MinusIcon,
  Moon as MoonIcon,
  Package as PackageIcon,
  Palette as PaletteIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Share2 as Share2Icon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  Sparkles as SparklesIcon,
  Star as StarIcon,
  Sun as SunIcon,
  Trash2 as Trash2Icon,
  User as UserIcon,
  X as XIcon,
} from "lucide-react"
import type { LucideProps } from "lucide-react"

// Create a registry mapping icon names to components
const iconRegistry = {
  Package: PackageIcon,
  ShoppingCart: ShoppingCartIcon,
  ShoppingBag: ShoppingBagIcon,
  Heart: HeartIcon,
  Share2: Share2Icon,
  Star: StarIcon,
  Sparkles: SparklesIcon,
  Folder: FolderIcon,
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  Filter: FilterIcon,
  Search: SearchIcon,
  Menu: MenuIcon,
  User: UserIcon,
  LogOut: LogOutIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  X: XIcon,
  Calendar: CalendarIcon,
  CreditCard: CreditCardIcon,
  CheckCircle: CheckCircleIcon,
  MapPin: MapPinIcon,
  Save: SaveIcon,
  Trash2: Trash2Icon,
  Check: CheckIcon,
  CheckIcon: CheckIcon,
  ChevronDown: ChevronDownIcon,
  ChevronDownIcon: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronUpIcon: ChevronUpIcon,
  ChevronRight: ChevronRightIcon,
  ChevronRightIcon: ChevronRightIcon,
  Circle: CircleIcon,
  CircleIcon: CircleIcon,
  XIcon: XIcon,
  Moon: MoonIcon,
  Sun: SunIcon,
  Palette: PaletteIcon,
} as const

type IconName = keyof typeof iconRegistry

interface IconProps {
  name?: string | null
  className?: string
  size?: string | number
}

export function Icon({ name, ...props }: IconProps) {
  if (!name) return null

  const IconComponent = iconRegistry[name as IconName] as React.ComponentType<LucideProps>

  if (!IconComponent) {
    // Fallback to Package icon if the specified icon doesn't exist
    const FallbackIcon = iconRegistry.Package
    return <FallbackIcon {...props} />
  }

  return <IconComponent {...props} />
}
