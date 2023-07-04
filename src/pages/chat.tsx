import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import PageContainer from "~/components/container/PageContainer"
import useAuth from "~/hooks/useAuth"
import { Send, UserCog2 } from 'lucide-react';
import Image from 'next/image'
import Link from "next/link"
import { randAvatar } from "~/utils/strings";
import useInbox from "~/hooks/useInbox";
import { validateEmail } from "~/utils/helpers";
import { UserConvo } from "~/components/ui/inbox";
import { useRouter } from "next/router"
import clsx from 'clsx'

const ChatPage = () => {
    const { searchByEmail, searchResult } = useInbox()
    const { user } = useAuth()
    const { query } = useRouter()
    return (
        <PageContainer>
            <div className="flex w-full h-full">
                <div className="flex bg-white w-[320px] border border-r-1 border-gray-100 gap-[20px] flex-col">
                    <div className="flex  flex-col px-[10px] py-[20px] backdrop-blur-3xl gap-[10px]">
                        <Link href={'/profile'}>
                            <div className="transition group rounded-md hover:cursor-pointer flex p-[10px] hover:bg-orange-100 gap-[10px] items-center">
                                <div className="flex border border-0 overflow-hidden rounded-[50%]">
                                    <Image width={72} height={72} src={user?.photoUrl ?? ""} alt="avatar" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between"><div className="text text-gray-800 font-bold text-[24px]">{user?.username}</div> <div className="transition-all group-hover:text-gray-500 text-white" ><UserCog2 /></div></div>
                                    <div className="text text-gray-500 text-[14px]">{user?.email}</div>
                                </div>
                            </div>
                        </Link>
                        {query.id && <Input
                            onChange={(e) => validateEmail(e.target.value) && searchByEmail(e.target.value)}
                            placeholder="Search Email" />}
                        <div className="flex w-full">
                            {query.id && searchResult.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                        </div>
                    </div>
                </div>
                <div className={clsx("flex static", !query?.id && 'w-full')}>
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
                    <div className="flex  max-w-[calc(100%-320px)] gap-[10px] w-full px-[20px] py-[10px] absolute bottom-[0px]">
                        {query?.id && (
                            <>
                                <Input placeholder="Send a message ✨" /> <Button className="bg-orange-100" variant={'secondary'}> <Send className="text-orange-400" /></Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
export default ChatPage