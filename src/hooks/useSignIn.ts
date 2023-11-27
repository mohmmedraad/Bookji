import { useRouter } from "next/navigation"

export const useSignIn = () => {
    const router = useRouter()
    function signIn() {
        router.push("sign-in")
    }
    return { signIn }
}
