import { type FC } from "react"

import { testimonials } from "@/config/site"
import Container from "@/components/ui/Container"
import TestimonialCard from "@/components/TestimonialCard"

interface TestimonialsProps {}

const Testimonials: FC<TestimonialsProps> = ({}) => {
    const [
        testimonialOne,
        testimonialTwo,
        testimonialThree,
        testimonialFour,
        testimonialFive,
        testimonialSix,
    ] = testimonials
    return (
        <section
            about="testimonials"
            className="relative overflow-hidden py-20 before:absolute before:left-0 before:top-0  before:h-full before:w-full before:bg-[#F6F6FE]  xl:pb-0 xl:before:h-[calc(80%+80px)]"
        >
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-[230.362px] text-[#E4E4E799]">
                Testimonials
            </div>
            <Container className="relative">
                <div className="max-w-[26rem]">
                    <p className="mb-2 text-sm text-primary">Testimonies</p>
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accentForeground md:text-5xl">
                        What People Say About Us
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        we started this business sice 1934, in that year there
                        was no online sale...
                    </p>
                </div>
                <div className="mt-20 grid justify-start gap-8 sm:grid-cols-2 lg:mt-60 lg:grid-cols-3 xl:grid-cols-test">
                    <div className="grid items-start gap-8 xl:grid-cols-2">
                        <TestimonialCard
                            name={testimonialOne.name}
                            jobTitle={testimonialOne.jobTitle}
                            avatar={testimonialOne.avatar}
                            comment={testimonialOne.comment}
                            className="relative"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="27"
                                viewBox="0 0 25 27"
                                fill="none"
                                className="absolute right-0 top-0 translate-y-[-150%]"
                            >
                                <path
                                    d="M22.5987 26.2216L10.7994 24.4101C8.46567 24.0518 6.29063 23.0096 4.54928 21.4152C2.80794 19.8207 1.5785 17.7457 1.01644 15.4526C0.45438 13.1594 0.584943 10.7511 1.39162 8.53214C2.19829 6.31318 3.64485 4.38327 5.54836 2.98644C7.45187 1.58961 9.72684 0.788606 12.0856 0.684719C14.4443 0.580832 16.7809 1.17873 18.7999 2.4028C20.8188 3.62687 22.4294 5.42214 23.4281 7.56158C24.4267 9.70103 24.7685 12.0886 24.4102 14.4222L22.5987 26.2216Z"
                                    fill="#32166D"
                                />
                            </svg>
                        </TestimonialCard>
                        <TestimonialCard
                            name={testimonialTwo.name}
                            jobTitle={testimonialTwo.jobTitle}
                            avatar={testimonialTwo.avatar}
                            comment={testimonialTwo.comment}
                            className="relative xl:-translate-y-1/4 "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="27"
                                viewBox="0 0 30 27"
                                fill="none"
                                className="absolute bottom-0 right-0 hidden translate-y-[150%] lg:block"
                            >
                                <path
                                    d="M0.475758 26.3481C3.82125 26.7943 7.22186 26.5771 10.4834 25.709C13.745 24.8409 16.8036 23.3388 19.4847 21.2887C22.1658 19.2385 24.4168 16.6803 26.1092 13.7602C27.8016 10.8401 28.9023 7.61524 29.3485 4.26974L3.87291 0.872591L0.475758 26.3481Z"
                                    fill="#F00B52"
                                />
                            </svg>
                        </TestimonialCard>
                    </div>
                    <div className="grid gap-8 sm:translate-y-1/4 lg:-translate-y-1/4 xl:-translate-y-1/2">
                        <TestimonialCard
                            name={testimonialThree.name}
                            jobTitle={testimonialThree.jobTitle}
                            avatar={testimonialThree.avatar}
                            comment={testimonialThree.comment}
                        />
                        <TestimonialCard
                            name={testimonialFour.name}
                            jobTitle={testimonialFour.jobTitle}
                            avatar={testimonialFour.avatar}
                            comment={testimonialFour.comment}
                        />
                    </div>
                    <div className="grid gap-8 xl:-translate-y-1/3">
                        <TestimonialCard
                            name={testimonialFive.name}
                            jobTitle={testimonialFive.jobTitle}
                            avatar={testimonialFive.avatar}
                            comment={testimonialFive.comment}
                            className="relative"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="35"
                                viewBox="0 0 27 35"
                                fill="none"
                                className="absolute left-0 top-0 hidden translate-y-[-150%] lg:block"
                            >
                                <path
                                    d="M16.4427 0.744555C13.3327 2.05572 10.5114 3.96661 8.13986 6.36812C5.76834 8.76963 3.89305 11.6147 2.62107 14.741C1.34908 17.8672 0.705316 21.2134 0.72652 24.5884C0.747724 27.9635 1.43349 31.3013 2.74465 34.4113L26.4271 24.427L16.4427 0.744555Z"
                                    fill="#F00B52"
                                />
                            </svg>
                        </TestimonialCard>
                        <TestimonialCard
                            name={testimonialSix.name}
                            jobTitle={testimonialSix.jobTitle}
                            avatar={testimonialSix.avatar}
                            comment={testimonialSix.comment}
                        />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Testimonials
