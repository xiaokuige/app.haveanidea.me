import {MenuIcon} from "@/components/Icons";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "HAVEANIDEA.ME",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Ideas",
      href: "/",
      icon: MenuIcon
    },
    {
      label: "Launch",
      href: "/launch",
      icon: MenuIcon
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
