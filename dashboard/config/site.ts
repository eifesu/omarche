export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "O'Marché Ivoire",
  description: "Plateforme de gestion de stock pour O'Marché Ivoire",
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Marchés",
      href: "/markets",
    },
    {
      title: "Commandes",
      href: "/orders",
    },
    {
      title: "Personnel",
      href: "/staff",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
  apiUrl: "http://localhost:3000",
}
