import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import PageContainer from "~/components/container/PageContainer"
import useAuth from "~/hooks/useAuth"
import { Send, UserCog2 } from 'lucide-react';
import Image from 'next/image'
import Link from "next/link"
import { randAvatar } from "~/utils/strings";
import useInbox, { Message } from "~/hooks/useInbox";
import { validateEmail } from "~/utils/helpers";
import { UserConvo } from "~/components/ui/inbox";
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import useUser from "~/hooks/useUser";
import { User, UserStore } from "~/store/userStore";
const ChatBubble = ({ chat }: { chat: Message }) => {
    const { user } = UserStore()
    return (
        <div className={clsx("flex text-[13px] w-full animate__animated animate__fastest ", user?._id == (chat as any)?.user ? "justify-end animate__fadeInUp" : "animate__fadeInUp")}>
            <div className={clsx("flex max-w-[320px] w-content rounded-[10px] px-[10px]  py-[5px] shadow-sm"
                , user?._id != (chat as any)?.user ? "bg-gradient-to-r from-red-200 text-gray-800 to-orange-200" : "text-white bg-gradient-to-r from-orange-400 to-orange-300"
            )}>{chat.text}</div>
        </div>
    )
}

const UseChatProfile = ({ user }: { user: User }) => {
    return (user && <div className="flex w-full items-center p-[20px] gap-[10px] justify-center flex-col">
        <Image className="rounded-[50%] animate__animated animate__fadeInDown" alt={user?.username} src={user?.photoUrl} width={100} height={100} />
        <div className="flex font-bold text-[36px] animate__animated animate__fastest animate__fadeInDown">
            {user?.username}
        </div>
    </div>)
}
const ChatPage = () => {
    const { searchByEmail, searchResult, suggestedUsers, currentConvo, connectedUser,allConvo, sendMessage } = useInbox()
    const { user: currentUser } = useAuth()
    const { query } = useRouter()
    const [message, setMessage] = useState(null)
    useEffect(() => {
        let scrollElement = document.getElementById("chatBox")
        if (scrollElement != undefined) {
            scrollElement.scrollTop = scrollElement.scrollHeight
        }
    }, [currentConvo])
    const lastChatRef = useRef(null)
    return (
        <PageContainer>
            <div className="flex w-full h-full">
                <div className="flex static bg-white min-w-[320px] border border-r-1 border-gray-100 gap-[20px] flex-col">
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
                            {connectedUser.map((_user, index) => <div className="flex" style={{ animation: `fadeInUp ${((index + 1) * 400)}ms ease` }}> <UserConvo activeChatId={query.id as any} user={_user} lastChat={allConvo[allConvo.findIndex(convo => convo.users.findIndex(id=> id == currentUser?._id + _user._id)!= -1)]?.lastChat ?? ""} /></div>)}
                        </div>
                    </div>
                    {suggestedUsers.slice(1).filter(user => connectedUser.findIndex(u => u._id == user._id) == -1).length != 0 && < div className="flex flex-col w-[300px] gap-[20px] absolute bottom-[0px] p-[20px]">
                        <div className="flex text-[13px] text-gray-400">
                            People you may know 🤸‍♀️
                        </div>
                        <div className="flex flex-col w-full gap-[10px]">
                            {suggestedUsers.slice(1).filter(user => connectedUser.findIndex(u => u._id == user._id) == -1 && user._id != currentUser?._id).map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                        </div>
                    </div>}
                </div>
                <div className={clsx("flex static h-full w-full", !query?.id && 'w-full')}>
                    {!query.id && (
                        <div className="flex w-full h-full  items-center justify-center">
                            <div className="flex flex-col gap-[10px] w-full max-w-[480px] p-[20px]">
                                <div className="flex text-gray-400 text-[13px]">{"Searching for someone? Try search 👇🏻 his/her email"} </div>
                                <Input
                                    className="text-gray-600 text-bold"
                                    onChange={(e) => validateEmail(e.target.value) && searchByEmail(e.target.value)}
                                    placeholder="Search Email" />
                                {searchResult.length != 0 && <div className="flex text-[12px] text-green-600">Yeeiihayy 🎉 We got results!🍻 Is he/she 👇🏻 you are looking for?</div>}
                                {searchResult.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                            </div>
                        </div>
                    )}
                    <div id={"chatBox"} className="flex flex-col gap-[10px] overflow-y-scroll w-full h-full p-[20px] bottom-[70px] pb-[70px]">
                        <UseChatProfile user={connectedUser.filter(user => user._id == query.id)[0] as User} />
                        {currentConvo?.messages?.reverse().map((message: Message, index: number) => {
                            if (index - 1 == currentConvo?.messages?.length) {
                                return <div ref={lastChatRef} className="flex "><ChatBubble chat={message} /></div>
                            }
                            return <ChatBubble chat={message} />
                        })}
                    </div>
                    <div className="flex backdrop-blur-2xl max-w-[calc(100%-320px)] gap-[10px] w-full px-[20px] py-[10px] absolute bottom-[0px]">
                        {query?.id && currentConvo && (
                            <>
                                <Input
                                    // value={message ?? ""}
                                    onKeyDown={(e: any) => {
                                        if (e.shiftKey && e.key === "Enter") {
                                            // Insert a line break
                                            // setText(e.target.value + "\n")
                                            setMessage(e.target.value)
                                        }
                                        else if (e.key === "Enter") {
                                            // Submit the form
                                            e.preventDefault(); // Prevents the default form submission
                                            // setMessage(e.target.value)
                                            if (e.target.value.trim().length != 0) {
                                                sendMessage({ text: e.target.value })
                                                setMessage(null)
                                                e.target.value = ""
                                            }

                                            // Replace the following line with your own code to handle form submission
                                        }
                                    }}
                                    placeholder="Send a message ✨" /> <Button className="bg-orange-100" variant={'secondary'}> <Send className="text-orange-400" /></Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer >
    )
}
export default ChatPage