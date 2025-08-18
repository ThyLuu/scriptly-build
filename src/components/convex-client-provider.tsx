'use client'

import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth, SignIn } from '@clerk/nextjs'
import { FullscreenLoader } from "./fullscreen-loader";
import { viVN } from '@clerk/localizations'
import { LandingPage } from "./landing-page";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider localization={viVN as any} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>
                    {children}
                </Authenticated>

                <Unauthenticated>
                    {/* <div className="flex flex-col items-center justify-center min-h-screen">
                        <SignIn routing="hash" />
                    </div> */}

                    <div>
                        <LandingPage />
                    </div>
                </Unauthenticated>

                <AuthLoading>
                    <FullscreenLoader label="Đang xác thực..." />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>

    )
}