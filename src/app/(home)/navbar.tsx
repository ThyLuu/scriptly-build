import Link from "next/link"
import { IoDocumentText } from "react-icons/io5"
import { SearchInput } from "./search-input"
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-full w-full">
            <div className="flex gap-3 items-center shrink-0 pr-6">
                <Link href={'/'}>
                    <IoDocumentText className="size-10 text-blue-500" />
                </Link>

                <h3 className="text-xl font-bold">
                    Scriptly
                </h3>
            </div>

            <SearchInput />

            <div className="flex gap-3 items-center pl-6">
                <OrganizationSwitcher
                    afterCreateOrganizationUrl={'/'}
                    afterLeaveOrganizationUrl="/"
                    afterSelectOrganizationUrl={'/'}
                    afterSelectPersonalUrl={'/'}
                />
                <UserButton />
            </div>
        </nav>
    )
}