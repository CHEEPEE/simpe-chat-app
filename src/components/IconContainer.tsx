import clsx from 'clsx'
import { useState, useRef, useEffect, MouseEventHandler } from 'react'

type props = {
    className?: string,
    component: React.FC,
    onClick?: MouseEventHandler<HTMLElement>,
    color?: string,
    hoverable?: boolean,
    disabled?: boolean
}

const baseClass = {
    icon: `min-w-[36px] min-h-[36px] focus:outline-none rounded-[6px] flex items-center justify-center`
}
const IconContainer: React.FC<props> = ({ className = "", component, onClick = () => { }, color = '#333333', hoverable = true, disabled = false }) => {
    const [isButtonPressedDown, setIsButtonPressedDown] = useState(false)

    return (
        <button disabled={disabled} onMouseDown={() => { setIsButtonPressedDown(true) }} onMouseUp={() => { setIsButtonPressedDown(false) }}
            onClick={onClick}
            className={clsx('group',
                baseClass.icon,
                hoverable && !disabled && "hover:bg-gray-3",
                disabled && 'opacity-50',
                !disabled && 'cursor-pointer',
                className
            )}>
            {component({ color: isButtonPressedDown && !disabled ? "#D0D0D0" : color })}
        </button>
    )
}

export default IconContainer