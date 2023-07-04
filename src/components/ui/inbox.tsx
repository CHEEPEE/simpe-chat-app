import { User } from "~/store/userStore";
import Image from 'next/image'
import Link from "next/link"
import clsx from 'clsx'
export const UserConvo = ({ user, lastChat = "", activeChatId }: { user: User, lastChat: string, activeChatId: string }) => {
    return (
        <Link className="w-full" href={{ query: { id: user._id } }}>
            <div className={clsx("flex transition-all w-full gap-[10px] hover:bg-orange-100 px-[10px] cursor-pointer rounded-xl py-[8px]",
                activeChatId == user._id && "bg-gradient-to-r from-orange-200 to-orange-100 shadow-md")}>
                <div className="flex rounded-[50%] overflow-hidden w-[36px] h-[36px]">
                    <Image width={36} height={36} alt={user.username} src={user.photoUrl} />
                </div>
                <div className="flex flex-col">
                    <div className={clsx("flex text-[13px]", activeChatId == user._id && "font-bold text-gray-800 text-[15px]")}>
                        <div className="flex text-bold">{user.username}</div>
                    </div>
                    <div className="flex text-[13px] text-gray-600">{lastChat} 💫</div>
                </div>
            </div>
        </Link>
    )
}