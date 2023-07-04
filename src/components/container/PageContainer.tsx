import { PropsWithChildren } from "react";

const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex bg-gradient-to-r from-white to-orange-100  w-full  h-full items-center justify-center">
            {children}
        </div>
    )
}

export default PageContainer