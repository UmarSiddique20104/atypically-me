import React from 'react'
import { Path, Svg } from 'react-native-svg'

const EditIcon = ({ size = 15, color = "#000" }) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fillRule="evenodd" clipRule="evenodd" d="M9.20678 0.793512C8.28208 -0.131524 7.58764 0.00741407 7.58764 0.00741407L4.34937 3.24321L0.646923 6.94701L0 10L3.05187 9.35284L6.75432 5.65269L9.99259 2.4169C9.99259 2.4169 10.1315 1.7222 9.20678 0.797168V0.793512ZM8.516 1.94524L2.90202 7.32361L2.64252 7.05305L8.25284 1.67102L8.51234 1.94158L8.516 1.94524Z"
                fill={color} />
        </Svg>

    )
}

export default EditIcon