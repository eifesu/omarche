import "@/styles/globals.css"
import { Metadata } from "next"
import React from "react"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { GeistSans } from "geist/font/sans"
import { Provider } from "react-redux"
import { store } from "@/redux/store"
import PageWrapper from "@/components/page-wrapper"

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body
                    className={cn(
                        "min-h-screen bg-background font-sans antialiased",
                        GeistSans.className
                    )}
                >
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                        <PageWrapper>
                            <div className="flex relative flex-col min-h-screen">
                                <SiteHeader />
                                <div className="flex-1">{children}</div>
                            </div>
                        </PageWrapper>
                    </ThemeProvider>
                </body>
            </html>
        </>
    )
}
