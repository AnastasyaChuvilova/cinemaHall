import "./Order.css"

interface TicketHeaderProps {
    title: string
}

export const TicketHeader = ({title}: TicketHeaderProps) => {
    return (
        <div className="order_header_frame">
            {title}
        </div>
    )
}