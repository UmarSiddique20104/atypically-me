import React from 'react'
import { Path, Svg } from 'react-native-svg'

const AddIcon = ({ size = 14 }) => {
    return (
        <Svg width={size}
            height={size}
            viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M3.56 9.76V0.24H6.64V9.76H3.56ZM0.16 6.46V3.54H10.02V6.46H0.16Z" fill="black" />
        </Svg>

    )
}

export default AddIcon