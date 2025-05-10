import React from 'react'
import { Rect, Svg } from 'react-native-svg'

const MenuIcon = ({ size = 20 }) => {
    return (
        <Svg width={size}
            height={size}
            viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Rect width="18" height="3" rx="1.5" fill="black" />
            <Rect y="6" width="18" height="3" rx="1.5" fill="black" />
            <Rect y="12" width="18" height="3" rx="1.5" fill="black" />
        </Svg>
    )
}

export default MenuIcon