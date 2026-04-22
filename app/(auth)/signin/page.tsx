import { AuthHero } from "../../../components/molecules/AuthHero";
import { AuthSheet } from "../../../components/molecules/AuthSheet";
import { SignInForm } from "../../../components/organisms/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-col">
      <AuthHero variant="signin" />
      <AuthSheet>
        <SignInForm />
      </AuthSheet>
    </div>
  );
}
