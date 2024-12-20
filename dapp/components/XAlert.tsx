import React, { useEffect, useState } from 'react';
import { Alert } from "@nextui-org/alert";

interface XAlertProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    color?: string;
}

const XAlert: React.FC<XAlertProps> = ({ message, visible, onClose, color = "success" }) => { // 默认值为 "success"
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (visible) {
            setFade(false);
            const fadeTimeout = setTimeout(() => {
                setFade(true);
            }, 5000); // 5秒后开始渐变

            const closeTimeout = setTimeout(() => {
                onClose();
            }, 6000); // 6秒后关闭

            return () => {
                clearTimeout(fadeTimeout);
                clearTimeout(closeTimeout);
            };
        }
    }, [visible, onClose]);

    return (
        visible && (
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}>
                <Alert
                    isOpen={visible}
                    onClose={onClose}
                    color={color}
                    className="rounded-lg shadow-lg p-4 text-white"
                >
                    {message}
                </Alert>
            </div>
        )
    );
};

export default XAlert;