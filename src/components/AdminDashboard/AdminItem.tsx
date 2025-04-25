import React, {useState} from "react";
import "./AdminDashboard.css"

interface AdminItemProps {
    title: string;
    first?: boolean;
    last?: boolean;
    content: React.ReactNode;
}

export const AdminItem = ({title, first, last, content}: AdminItemProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleBody = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div>
            <div className={"admin_item_header common_text font_700"} onClick={toggleBody}>
                {!first ?
                    <div className={"admin_header_line_top"}/>
                    :
                    <></>
                }
                <div className="circle_decoration"/>
                {!last ?
                    <div className={"admin_header_line_bottom"}/>
                    :
                    <></>
                }
                <div className="admin_item_header_title">{title}</div>
                <div className={"down_arrow"} />
            </div>
            {isOpen && (
                <div className={"admin_item_body"}>
                    {!last ?
                        <div className={"admin_body_line"}/>
                        :
                        <></>
                    }
                    {content}
                </div>
            )}
        </div>
    );
}