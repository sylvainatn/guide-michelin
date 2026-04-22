import { BackPill } from "../../../components/molecules/BackPill";
import { ForgotPasswordForm } from "../../../components/organisms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-full flex-col gap-6 bg-neutral-50 px-6 py-6">
      <BackPill />
      <ForgotPasswordForm />
    </div>
  );
};
