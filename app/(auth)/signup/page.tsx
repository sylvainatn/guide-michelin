import { AuthFooterLink } from "../../../components/molecules/AuthFooterLink";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { SignUpForm } from "../../../components/organisms/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Créer un compte"
        subtitle="Rejoins le Guide Michelin."
        align="center"
      />
      <SignUpForm />
      <AuthFooterLink
        question="Déjà un compte ?"
        linkLabel="Se connecter"
        href="/signin"
      />
    </div>
  );
}
