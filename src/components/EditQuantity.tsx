import { useEffect, useState, type FC } from "react"
import { useRouter } from "next/navigation"
import { type TRPCError } from "@trpc/server"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import useCart from "@/hooks/useCart"
import useDebounce from "@/hooks/useDebounce"
import { trpc } from "@/app/_trpc/client"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

interface EditQuantityProps {
    bookId: string
    bookQuantity: number
}

const EditQuantity: FC<EditQuantityProps> = ({ bookQuantity, bookId }) => {
    const [quantity, setQuantity] = useState(bookQuantity)
    const updateCart = useCart((state) => state.updateCart)
    const undoChanging = useCart((state) => state.undoChanging)
    const cartBooks = useCart((state) => state.cartBooks)
    const quantityValue = useDebounce(quantity, 1000)
    const router = useRouter()
    const { mutate: addToCart } = trpc.cart.update.useMutation({
        onError: (error) => {
            undoChanging()
            handleTRPCError(error.data?.code)
        },
    })

    function handleTRPCError(errorCode: TRPCError["code"] | undefined) {
        if (errorCode === "UNAUTHORIZED") {
            toast.error("Please login first")
            router.push("/sign-in")
        }
        return handleGenericError()
    }

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

    useEffect(() => {
        if (!quantityValue) return
        addToCart(cartBooks)
    }, [quantityValue])

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
