import { AuthFooterLink } from "../../../components/molecules/AuthFooterLink";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { SignInForm } from "../../../components/organisms/SignInForm";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Se connecter"
        subtitle="Accède à ton compte Guide Michelin."
        align="center"
      />
      <SignInForm />
      <AuthFooterLink
        question="Pas encore de compte ?"
        linkLabel="Créer un compte"
        href="/signup"
      />
    </div>
  );
}
