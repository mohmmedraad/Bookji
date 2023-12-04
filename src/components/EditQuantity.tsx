import { useState, type FC } from "react"
import { Minus, Plus } from "lucide-react"

import useCart from "@/hooks/useCart"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

interface EditQuantityProps {
    bookId: string
    bookQuantity: number
}

const EditQuantity: FC<EditQuantityProps> = ({ bookQuantity, bookId }) => {
    const [quantity, setQuantity] = useState(bookQuantity)
    const updateCart = useCart((state) => state.updateCart)

    const handleIncrement = () => {
        if (quantity >= 100) return
        updateCart({ bookId, quantity: quantity + 1 })
        setQuantity(quantity + 1)
    }
    const handleDecrement = () => {
        if (quantity <= 1) return
        updateCart({
            bookId,
            quantity: quantity - 1,
        })
        setQuantity(quantity - 1)
    }

    return (
        <div className="flex items-center justify-center">
            <Button
                variant={"outline"}
                className="rounded-r-none"
                onClick={handleDecrement}
            >
                <Minus className="h-3 w-3 text-foreground" />
            </Button>
            <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                    updateCart({
                        bookId,
                        quantity: +e.target.value,
                    })
                    setQuantity(+e.target.value)
                }}
                min={1}
                max={100}
                className="max-w-[70px] rounded-none"
            />
            <Button
                variant={"outline"}
                className="rounded-l-none "
                onClick={handleIncrement}
            >
                <Plus className="h-3 w-3 text-foreground" />
            </Button>
        </div>
    )
}

export default EditQuantity
