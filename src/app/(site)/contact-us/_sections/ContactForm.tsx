import { type FC } from "react"
import { Mail, MoveRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import Container from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/Textarea"

interface ContactFormProps {}

/**
 * TODO: Use custom form & Add the send functionality
 */
const ContactForm: FC<ContactFormProps> = ({}) => {
    return (
        <section className="relative overflow-x-clip py-20">
            <div
                className="absolute left-0 top-0 h-[830px] w-full min-w-[1536px] bg-primary lg:h-[732px]"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 60%, 0 80%)",
                }}
            />
            <Container className="isolate grid items-center gap-20 lg:grid-cols-2">
                <div className="max-w-2xl">
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-white md:text-5xl">
                        Have a Problem!
                        <br />
                        Drop us a line.
                    </h2>
                    <p className="mt-4 text-base text-gray-100">
                        Aenean vestibulum felis nec egestas fringilla. Duis non
                        felis consequat, varius sapien convallis, tincidunt
                        nisl.
                    </p>
                    <div className="mt-8 flex gap-5">
                        <div className="rounded-lg bg-[#F63C76] p-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-white">Email us</p>
                            <p className="text-2xl font-bold text-white">
                                info@golio.com
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <form className="rounded-3xl bg-white p-6 shadow-lg">
                        <p className="text-2xl font-semibold">
                            Send Us A Message
                        </p>
                        <p className="mt-4 text-base text-gray-500">
                            Drop us a line if you want to work together. Or do
                            you need our help? Feel free to contact us.
                        </p>
                        <div className="mt-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium">
                                        Name
                                    </label>
                                    <Input className="w-full" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input className="w-full" />
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-3">
                                <label className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input className="w-full" />
                            </div>
                            <div className="mt-4 flex flex-col gap-3">
                                <label className="text-sm font-medium">
                                    Message
                                </label>
                                <Textarea
                                    className="h-16 w-full"
                                    placeholder="Tell us"
                                />
                            </div>
                            <Button className="mt-6">
                                Send
                                <MoveRight className="ml-2 h-6 w-6" />
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    )
}

export default ContactForm
