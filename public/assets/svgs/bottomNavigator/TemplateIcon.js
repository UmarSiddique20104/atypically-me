import React from 'react'
import { Circle, Svg } from 'react-native-svg'

const TemplateIcon = ({ color = "#fff" }) => {
    return (
        <Svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Circle cx="21" cy="19" r="7.6" stroke={color} stroke-width="0.8" />
            <Circle cx="5.5" cy="12.5" r="5.1" stroke={color} stroke-width="0.8" />
            <Circle cx="16" cy="4" r="3.6" stroke={color} stroke-width="0.8" />
        </Svg>

    )
}

export default TemplateIcon