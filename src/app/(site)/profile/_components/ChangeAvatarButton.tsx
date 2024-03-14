import { type FC } from "react"
import { PencilLine } from "lucide-react"

import { Button } from "@/components/ui/Button"

interface ChangeAvatarButtonProps {}

const ChangeAvatarButton: FC<ChangeAvatarButtonProps> = ({}) => {
    return (
        <Button className="flex items-center gap-2">
            <PencilLine className="h-4 w-4 bg-white" />
            Change picture
        </Button>
    )
}

export default ChangeAvatarButton
