import { View, Text } from 'react-native'
import React from 'react'
import { Path, Svg } from 'react-native-svg'

const BackIcon = ({ color = "white", size = 10 }) => {
    return (
        <Svg
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 7 9" fill="none">
            <Path d="M0.238868 4.02454L4.84681 0.198343C5.1653 -0.0661145 5.6803 -0.0661145 5.9954 0.198343L6.76113 0.834167C7.07962 1.09862 7.07962 1.52626 6.76113 1.7879L3.49492 4.5L6.76113 7.2121C7.07962 7.47655 7.07962 7.90419 6.76113 8.16583L5.9954 8.80166C5.67691 9.06611 5.16191 9.06611 4.84681 8.80166L0.238868 4.97546C-0.079622 4.71663 -0.079622 4.289 0.238868 4.02454Z"
                fill={color}
            />
        </Svg>
    )
}

export default BackIcon