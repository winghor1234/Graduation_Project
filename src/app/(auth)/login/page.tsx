import { AuthCard } from "@/components/adminComponent/auth/AuthCard"
import LoginForm from "@/components/adminComponent/auth/LoginForm"

export default function LoginPage() {
    return (
        <AuthCard title="ເຂົ້າສູ່ລະບົບ" subtitle="ສຳລັບລູກຄ້າ, Admin ແລະ Staff">
            <LoginForm />
        </AuthCard>
    )
}
