import {useState} from "react";
import "./CommonButton.css"

interface CommonButtonProps {
    onClick: () => void;
    className?: string;
    title: string;
    disabled?: boolean;
}

export const CommonButton = ({ onClick, className, title, disabled }: CommonButtonProps) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <button
            className={`common_button ${className} ${isPressed ? "button--pressed" : ""}`}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
};