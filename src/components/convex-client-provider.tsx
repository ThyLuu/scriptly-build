'use client'

import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { FullscreenLoader } from "./fullscreen-loader";
import { viVN } from '@clerk/localizations'
import { LandingPage } from "./landing-page";
import { useSyncUser } from "@/hooks/use-sync-user";
import type { LocalizationResource } from '@clerk/types'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider localization={viVN as LocalizationResource} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>
                    {/* {children} */}
                    <SyncUserWrapper>{children}</SyncUserWrapper>
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

function SyncUserWrapper({ children }: { children: ReactNode }) {
    useSyncUser();
    return <>{children}</>;
}