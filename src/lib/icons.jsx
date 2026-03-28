/**
 * ICO Icon Library — Phosphor Icons
 * Centrale import voor alle icons in de applicatie.
 * Gebruik altijd: import { ... } from '@/lib/icons'
 * NOOIT rechtstreeks vanuit 'lucide-react' of '@phosphor-icons/react'
 */

// ── Direct re-exports (zelfde naam in Phosphor) ──────────────────────────────
export {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Check,
  X,
  Eye,
  Lock,
  Phone,
  MapPin,
  Clock,
  Calendar,
  User,
  Users,
  ShoppingBag,
  ShoppingCart,
  Package,
  Truck,
  Car,
  Shield,
  ShieldCheck,
  Star,
  Sparkle,
  Wrench,
  Image,
  Globe,
  Copy,
  Info,
  Wind,
  Armchair,
  Circle,
  Square,
  Pencil,
  FileText,
  Drop,
} from '@phosphor-icons/react'

// ── Aliassen — Lucide naam → Phosphor naam ───────────────────────────────────
export {
  CaretRight as ChevronRight,
  CaretLeft as ChevronLeft,
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  CircleNotch as Loader2,
  Trash as Trash2,
  CheckCircle as CheckCircle2,
  SignOut as LogOut,
  SquaresFour as LayoutDashboard,
  CalendarDots as CalendarDays,
  Warning as AlertCircle,
  Warning as AlertTriangle,
  EyeSlash as EyeOff,
  Envelope as Mail,
  Gear as Settings,
  ChatCircle as MessageCircle,
  InstagramLogo as Instagram,
  FacebookLogo as Facebook,
  WhatsappLogo as MessageSquare,
  ArrowsCounterClockwise as RefreshCw,
  ArrowSquareOut as ExternalLink,
  MagnifyingGlass as Search,
  Funnel as Filter,
  PencilSimple as Edit,
  UploadSimple as Upload,
  FloppyDisk as Save,
  House as Home,
  List as Menu,
  Rows as LayoutList,
  ShieldWarning as ShieldAlert,
  Stack as Layers,
  SortDescending as SortDesc,
  Drop as Droplets,
  Drop as GlassWater,
  Sparkle as Sparkles,
  SignIn as LogIn,
  Question as HelpCircle,
  DotsSixVertical as GripVertical,
  BookOpen,
  TrendUp as TrendingUp,
  CalendarCheck as CalendarClock,
  ClipboardText,
  TextB as Bold,
  TextItalic as Italic,
} from '@phosphor-icons/react'

// ── DynamicIcon — Phosphor op basis van DB-opgeslagen naam ───────────────────
import * as Ph from '@phosphor-icons/react'

// Mapping van DB icon namen (Lucide-stijl) naar Phosphor iconen
const ICON_MAP = {
  // Lucide → Phosphor naam mapping
  Droplets: Ph.Drop,
  GlassWater: Ph.Drop,
  Sparkles: Ph.Sparkle,
  Sofa: Ph.Armchair,
  ChevronUp: Ph.CaretUp,
  ChevronDown: Ph.CaretDown,
  ChevronLeft: Ph.CaretLeft,
  ChevronRight: Ph.CaretRight,
  LogOut: Ph.SignOut,
  LayoutDashboard: Ph.SquaresFour,
  CalendarDays: Ph.CalendarDots,
  AlertCircle: Ph.Warning,
  AlertTriangle: Ph.Warning,
  EyeOff: Ph.EyeSlash,
  Mail: Ph.Envelope,
  Settings: Ph.Gear,
  MessageCircle: Ph.ChatCircle,
  Instagram: Ph.InstagramLogo,
  Facebook: Ph.FacebookLogo,
  Search: Ph.MagnifyingGlass,
  Filter: Ph.Funnel,
  Edit: Ph.PencilSimple,
  Upload: Ph.UploadSimple,
  Save: Ph.FloppyDisk,
  Home: Ph.House,
  Menu: Ph.List,
  Layers: Ph.Stack,
  ShieldAlert: Ph.ShieldWarning,
  Trash2: Ph.Trash,
  CheckCircle2: Ph.CheckCircle,
  Loader2: Ph.CircleNotch,
  Truck: Ph.Truck,
  // Directe matches (al goed in Phosphor)
  ArrowRight: Ph.ArrowRight,
  ArrowLeft: Ph.ArrowLeft,
  Plus: Ph.Plus,
  Minus: Ph.Minus,
  Check: Ph.Check,
  X: Ph.X,
  Eye: Ph.Eye,
  Lock: Ph.Lock,
  Phone: Ph.Phone,
  MapPin: Ph.MapPin,
  Clock: Ph.Clock,
  Calendar: Ph.Calendar,
  User: Ph.User,
  ShoppingBag: Ph.ShoppingBag,
  Package: Ph.Package,
  Car: Ph.Car,
  Shield: Ph.Shield,
  ShieldCheck: Ph.ShieldCheck,
  Star: Ph.Star,
  Sparkle: Ph.Sparkle,
  Wrench: Ph.Wrench,
  Image: Ph.Image,
  Globe: Ph.Globe,
  Info: Ph.Info,
  Wind: Ph.Wind,
  Armchair: Ph.Armchair,
  Circle: Ph.Circle,
  Square: Ph.Square,
  Pencil: Ph.Pencil,
  FileText: Ph.FileText,
  Drop: Ph.Drop,
}

/**
 * DynamicIcon — rendert een Phosphor icon op basis van een string naam
 * (zoals opgeslagen in de database). Fallback: Sparkle.
 *
 * @param {string} name - Icon naam (Lucide of Phosphor stijl)
 * @param {string} [weight='regular'] - Phosphor weight: thin|light|regular|bold|fill|duotone
 */
export function DynamicIcon({ name, weight = 'regular', className, style, ...props }) {
  const Icon = ICON_MAP[name] || Ph[name] || Ph.Sparkle
  return <Icon weight={weight} className={className} style={style} {...props} />
}
