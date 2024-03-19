import { useEffect, useState, type FC } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import useCart from "@/hooks/useCart"
import useDebounce from "@/hooks/useDebounce"
import { trpc } from "@/app/_trpc/client"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

interface EditQuantityProps {
    bookId: number
    bookQuantity: number
}

const EditQuantity: FC<EditQuantityProps> = ({ bookQuantity, bookId }) => {
    const [quantity, setQuantity] = useState(bookQuantity)
    const updateCart = useCart((state) => state.updateCart)
    const undoChanging = useCart((state) => state.undoChanging)
    const cartBooks = useCart((state) => state.cartBooks)
    const quantityValue = useDebounce(quantity, 1000)
    const router = useRouter()
    const pathName = usePathname()

    const { mutate: updateDbCart } = trpc.cart.update.useMutation({
        onError: (error) => {
            undoChanging()
            const errorCode = error.data?.code
            if (errorCode === "UNAUTHORIZED") {
                toast.error("Please login first")
                return router.push(`/sign-in?_origin=${pathName}`)
            }
            return handleGenericError()
        },
    })

    const handleIncrement = () => {
        if (quantity >= 100) return
        updateCart({
            bookId,
            quantity: quantity + 1,
            storeId: cartBooks.find((book) => book.bookId === bookId)!.storeId,
        })
        setQuantity(quantity + 1)
    }
    const handleDecrement = () => {
        if (quantity <= 1) return
        updateCart({
            bookId,
            quantity: quantity - 1,
            storeId: cartBooks.find((book) => book.bookId === bookId)!.storeId,
        })
        setQuantity(quantity - 1)
    }

    useEffect(() => {
        if (!quantityValue) return
        updateDbCart({
            bookId,
            quantity: quantityValue,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        storeId: cartBooks.find(
                            (book) => book.bookId === bookId
                        )!.storeId,
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
