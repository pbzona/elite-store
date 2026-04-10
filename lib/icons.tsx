// Direct imports of only the icons used in the app to avoid loading 454+ unused icons
import PackageIcon from "lucide-react/dist/esm/icons/package"
import ShoppingCartIcon from "lucide-react/dist/esm/icons/shopping-cart"
import ShoppingBagIcon from "lucide-react/dist/esm/icons/shopping-bag"
import HeartIcon from "lucide-react/dist/esm/icons/heart"
import Share2Icon from "lucide-react/dist/esm/icons/share-2"
import StarIcon from "lucide-react/dist/esm/icons/star"
import SparklesIcon from "lucide-react/dist/esm/icons/sparkles"
import FolderIcon from "lucide-react/dist/esm/icons/folder"
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right"
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left"
import FilterIcon from "lucide-react/dist/esm/icons/filter"
import SearchIcon from "lucide-react/dist/esm/icons/search"
import MenuIcon from "lucide-react/dist/esm/icons/menu"
import UserIcon from "lucide-react/dist/esm/icons/user"
import LogOutIcon from "lucide-react/dist/esm/icons/log-out"
import PlusIcon from "lucide-react/dist/esm/icons/plus"
import MinusIcon from "lucide-react/dist/esm/icons/minus"
import XIcon from "lucide-react/dist/esm/icons/x"
import CalendarIcon from "lucide-react/dist/esm/icons/calendar"
import CreditCardIcon from "lucide-react/dist/esm/icons/credit-card"
import CheckCircleIcon from "lucide-react/dist/esm/icons/check-circle"
import MapPinIcon from "lucide-react/dist/esm/icons/map-pin"
import SaveIcon from "lucide-react/dist/esm/icons/save"
import Trash2Icon from "lucide-react/dist/esm/icons/trash-2"
import CheckIcon from "lucide-react/dist/esm/icons/check"
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down"
import ChevronUpIcon from "lucide-react/dist/esm/icons/chevron-up"
import ChevronRightIcon from "lucide-react/dist/esm/icons/chevron-right"
import CircleIcon from "lucide-react/dist/esm/icons/circle"
import MoonIcon from "lucide-react/dist/esm/icons/moon"
import SunIcon from "lucide-react/dist/esm/icons/sun"
import PaletteIcon from "lucide-react/dist/esm/icons/palette"
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
