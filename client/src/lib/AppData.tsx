import { HelpCircle, Home, MapPin, Settings, ShoppingCart, User } from 'lucide-react';

const AppData = () => {
  const navLinks: INavLink[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Restaurants',
      href: '/restaurants',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
  ];
  const userMenuOptions: IUserMenuOption[] = [
    {
      label: 'Profile',
      href: '/profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      label: 'Addresses',
      href: '/addresses',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: 'Help',
      href: '/help',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];
  const routesToHideNavBar = ['/signin', '/signup']
  return { navLinks, userMenuOptions, routesToHideNavBar };
}

export default AppData;