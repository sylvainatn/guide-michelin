import { AuthHero } from "../../../components/molecules/AuthHero";
import { AuthSheet } from "../../../components/molecules/AuthSheet";
import { SignUpForm } from "../../../components/organisms/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col">
      <AuthHero variant="signup" />
      <AuthSheet>
        <SignUpForm />
      </AuthSheet>
    </div>
  );
}
