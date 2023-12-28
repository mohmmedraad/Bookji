interface PageHeadingProps {
    children: React.ReactNode
}

const PageHeading: React.FC<PageHeadingProps> = ({ children }) => {
    return (
        <h2 className="pb-3 text-3xl font-semibold text-[#101828]">
            {children}
        </h2>
    )
}

export default PageHeading
