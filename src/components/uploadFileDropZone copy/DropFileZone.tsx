import React, { type FC } from "react"

import { Label } from "../ui/label"

interface DropFileZoneProps {
    uploadContent: React.ReactNode
    onChange: (file: File | null) => void
}

const DropFileZone: FC<DropFileZoneProps> = ({ uploadContent, onChange }) => {
    return (
        <Label htmlFor="file" className="block h-full rounded-[inherit]">
            <div className="relative  h-full rounded-[inherit] border-[1px] border-dashed border-primary bg-primary/10 p-6">
                {uploadContent ? uploadContent : null}
                <input
                    name="file"
                    id="file"
                    type="file"
                    className="absolute inset-0 w-full opacity-0"
                    accept=".jpg, .jpeg, .png, .webp"
                    onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                    }
                />
            </div>
        </Label>
    )
}

export default DropFileZone
