// Named imports from lucide-react main module
// The package has "sideEffects": false so modern bundlers will tree-shake unused exports
import {
  Package as PackageIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Heart as HeartIcon,
  Share2 as Share2Icon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
  Folder as FolderIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Calendar as CalendarIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  MapPin as MapPinIcon,
  Save as SaveIcon,
  Trash2 as Trash2Icon,
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Palette as PaletteIcon,
  type LucideProps,
} from "lucide-react"

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
