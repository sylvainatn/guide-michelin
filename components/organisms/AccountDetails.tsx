import type { PublicUser } from "../../lib/auth/client";
import { DefinitionRow } from "../molecules/DefinitionRow";

export const AccountDetails = ({ user }: { user: PublicUser }) => (
  <dl className="space-y-3 rounded-md border border-neutral-200 p-4 text-sm">
    <DefinitionRow label="Email" value={user.email} />
    <DefinitionRow label="Prénom" value={user.firstName} />
    <DefinitionRow label="Nom" value={user.lastName} />
    <DefinitionRow
      label="Email vérifié"
      value={user.emailVerified ? "Oui" : "Non"}
    />
    <DefinitionRow
      label="Inscrit le"
      value={new Date(user.createdAt).toLocaleDateString("fr-FR")}
    />
  </dl>
);
