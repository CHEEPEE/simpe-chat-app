import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import Link from "next/link"
import { useSession } from "next-auth/react"


import 'animate.css';
import IconContainer from "./IconContainer";

type props = {
    menu?: ReactNode,
    isBlank?: boolean,
    pageHeader?: ReactNode,
}


export const MenuIcon = () => {
    return (
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0.5C0 0.223858 0.223858 0 0.5 0H13.5C13.7761 0 14 0.223858 14 0.5C14 0.776142 13.7761 1 13.5 1H0.5C0.223858 1 0 0.776142 0 0.5ZM0 10.5C0 10.2239 0.223858 10 0.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H0.5C0.223858 11 0 10.7761 0 10.5ZM0.5 5C0.223858 5 0 5.22386 0 5.5C0 5.77614 0.223858 6 0.5 6H13.5C13.7761 6 14 5.77614 14 5.5C14 5.22386 13.7761 5 13.5 5H0.5Z" fill="#333333" />
        </svg>
    )
}

const SideBarLayout: React.FC<PropsWithChildren<props>> = ({ children, menu, isBlank = false, pageHeader }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    return (
        <>
            <div className="flex h-full overflow-hidden flex-row bg-gray-100 text-gray-800">
                <aside style={{ borderRight: 'solid 1px #EFEFEF' }}
                    className={clsx(
                        isMenuOpen && 'md:relative translate-x-0 absolute', ['md:', isMenuOpen ? 'translate-x-0' : '-translate-x-full'],
                        'sidebar h-full w-[280px] z-[2020] transform bg-white transition-transform duration-150 ease-in'
                    )}
                >

                </aside>
                {/* {!isMenuOpen && <IconContainer onClick={() => { setIsMenuOpen(true) }} component={() => <MenuIcon />} />}{children} */}
                <main className={clsx(
                    "main h-full overflow-hiddenflex flex-grow flex-col md:transition-all md:duration-150 md:ease-in", [isMenuOpen ? 'md:ml-0' : '-ml-[280px]']
                )}>
                    {/* {!isMenuOpen && <IconContainer onClick={() => { setIsMenuOpen(true) }} component={() => <MenuIcon />} />}{children} */}

                    <div className="static items-center flex flex-col h-full overflow-hidden bg-white shadow-md">
                        {children}
                    </div>
                </main>
                {/* <div className={clsx('flex transition-all bg-gray-light', router.asPath.includes("/bookmark") ? 'w-[320px]' : 'w-[0px]')}>
                side pane
            </div> */}
            </div>

        </>
    )
}

export default SideBarLayout