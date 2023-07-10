import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import PageContainer from "~/components/container/PageContainer"
import useAuth from "~/hooks/useAuth"
import { Send, UserCog2 } from 'lucide-react';
import Image from 'next/image'
import Link from "next/link"
import { convoStarter, randAvatar } from "~/utils/strings";
import useInbox, { Message } from "~/hooks/useInbox";
import { validateEmail } from "~/utils/helpers";
import { UserConvo } from "~/components/ui/inbox";
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import useUser from "~/hooks/useUser";
import { User, UserStore } from "~/store/userStore";
import CurrentConvoBox from "~/components/ui/CurrentConvo";
import IconContainer from "~/components/IconContainer";
import { MenuIcon } from "~/components/Drawer";
import { useOnClickOutside, useScreen } from "usehooks-ts"




const ChatPage = () => {
    const { searchByEmail, getConnectedUser, suggestUser, setCurretntConvo, getConvo, searchResult, suggestedUsers, currentConvo, connectedUsers, allConvo, getCurrentConvo, sendMessage } = useInbox()
    const { user: currentUser } = useAuth()
    const { query } = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const screen = useScreen()

    const outside = useRef(null)
    const FeaturehandleClickOutside = () => {
        // Your custom logic here
        if (isMenuOpen && screen?.width && screen.width < 720) {
            setIsMenuOpen(false)
        }
    }
    useOnClickOutside(outside, FeaturehandleClickOutside)

    useEffect(() => {
        console.log(suggestUser);

        suggestUser()
        if (currentUser?._id) {
            getConnectedUser(currentUser._id)
        }
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        if (currentUser?._id) {
            getConnectedUser(currentUser._id)
        }
    }, [currentUser])
    useEffect(() => {
        setCurretntConvo(null as any)
        let unSub: any = () => { }
        if (query.id && currentUser?._id) {
            getConnectedUser(currentUser._id)
            getConvo({ currentUserId: currentUser._id, recipientId: query.id as string })
        }
        return (() => {
            unSub()
        })
    }, [query, currentUser])

    return (
        <PageContainer>
            {/* <div className="flex w-full h-full">
                <div className="flex  h-full static bg-white min-w-[320px] border border-r-1 border-gray-100 gap-[20px] flex-col">

                </div>
            </div> */}

            <div className="flex h-full w-full overflow-hidden flex-row bg-gray-100 text-gray-800">
                <aside ref={outside} style={{ borderRight: 'solid 1px #EFEFEF' }}
                    className={clsx(
                        isMenuOpen && 'md:relative translate-x-0 absolute', ['md:', isMenuOpen ? 'translate-x-0' : '-translate-x-full'],
                        'sidebar h-full w-[280px] z-[2020] transform bg-white transition-transform duration-150 ease-in'
                    )}
                >
                    <div className="flex  flex-col px-[10px] py-[20px] backdrop-blur-3xl gap-[10px]">
                        <Link href={'/profile'}>
                            <div className="transition group rounded-md hover:cursor-pointer flex p-[10px] hover:bg-orange-100 gap-[10px] items-center">
                                <div className="flex border border-0 overflow-hidden rounded-[50%]">
                                    <Image width={72} height={72} src={currentUser?.photoUrl ?? ""} alt="avatar" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between"><div className="text text-gray-800 font-bold text-[24px]">{currentUser?.username}</div> <div className="transition-all group-hover:text-gray-500 text-white" ><UserCog2 /></div></div>
                                    <div className="text text-gray-500 text-[14px]">{currentUser?.email}</div>
                                </div>
                            </div>
                        </Link>
                        {query.id &&
                            <Input
                                onChange={(e) => validateEmail(e.target.value) && searchByEmail(e.target.value)}
                                placeholder="Search Email" />}
                        <div className="flex gap-[5px] w-full flex-col">
                            {query.id && searchResult.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                            {connectedUsers.map((_user, index) => <div className="flex" style={{ animation: `fadeInUp ${((index + 1) * 400)}ms ease` }}> <UserConvo activeChatId={query.id as any} user={_user} lastChat={allConvo[allConvo.findIndex(convo => convo.users.findIndex(id => id == currentUser?._id + _user._id) != -1)]?.lastChat ?? ""} /></div>)}
                        </div>
                    </div>
                    {suggestedUsers.slice(1).filter(user => connectedUsers.findIndex(u => u._id == user._id) == -1).length != 0 && < div className="flex flex-col w-[300px] gap-[20px] absolute bottom-[0px] p-[20px]">
                        <div className="flex text-[13px] text-gray-400">
                            People you may know 🤸‍♀️
                        </div>
                        <div className="flex flex-col w-full gap-[10px]">
                            {suggestedUsers.slice(0).filter(user => connectedUsers.findIndex(u => u._id == user._id) == -1 && user._id != currentUser?._id).map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat={convoStarter() as string} />)}
                        </div>
                    </div>}
                </aside>
                <main className={clsx(
                    "main h-full bg-white overflow-hiddenflex flex-grow flex-col md:transition-all md:duration-150 md:ease-in", [isMenuOpen ? 'md:ml-0' : '-ml-[280px]']
                )}>
                    {<div className="flex  max-w-[36px]"><IconContainer onClick={() => { setIsMenuOpen(!isMenuOpen) }} component={() => <MenuIcon />} /></div>}

                    <div className="static items-center flex flex-col h-full overflow-hidden bg-white shadow-md">
                        <CurrentConvoBox />
                    </div>
                </main>
                {/* <div className={clsx('flex transition-all bg-gray-light', router.asPath.includes("/bookmark") ? 'w-[320px]' : 'w-[0px]')}>
                side pane
            </div> */}
            </div>
        </PageContainer >
    )
}
export default ChatPage