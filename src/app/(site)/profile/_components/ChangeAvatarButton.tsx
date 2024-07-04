import { type FC } from "react"
import { PencilLine } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ChangeAvatarButtonProps {}

const ChangeAvatarButton: FC<ChangeAvatarButtonProps> = ({}) => {
    return (
        <Button className="flex items-center gap-2">
            <PencilLine className="h-4 w-4 text-white" />
            <span className="hidden xs:block">Change picture</span>
        </Button>
    )
}

export default ChangeAvatarButton
