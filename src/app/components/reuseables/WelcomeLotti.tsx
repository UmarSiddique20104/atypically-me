'use client'
import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { useRouter } from 'next/navigation'

interface WelcomeLottiProps {
    animationData: any;
    width?: number;
    height?: number;
}

const WelcomeLotti: React.FC<WelcomeLottiProps> = ({ animationData, width = 300, height = 300 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        let anim: AnimationItem | undefined;

        if (containerRef.current) {
            anim = lottie.loadAnimation({
                container: containerRef.current!,
                renderer: 'svg',
                // loop: true,
                // autoplay: true,
                animationData: animationData,
            });

            const timer = setTimeout(() => {
                router.push('/welcome');
            }, 2000);

            return () => {
                if (anim) {
                    anim.destroy();
                }
                clearTimeout(timer); 
            };
        }
    }, [animationData, router]);

    return <div ref={containerRef} style={{ width, height }} />;
};

export default WelcomeLotti;
