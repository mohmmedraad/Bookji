import { type FC } from "react"

interface PriceProps {
    quantity: number
    price: number
}

const Price: FC<PriceProps> = ({ quantity, price }) => {
    return (
        <div className="text-xm mt-2 text-foreground">
            {price} x {quantity} = {quantity * price}
        </div>
    )
}

export default Price
