"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FingerprintIcon, LockIcon, PlusIcon } from "../atoms/icons";
import { ToggleSwitch } from "../atoms/ToggleSwitch";
import { AddPaymentCardDialog } from "../molecules/AddPaymentCardDialog";
import { AddPaymentMethodButton } from "../molecules/AddPaymentMethodButton";
import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { InfoBanner } from "../molecules/InfoBanner";
import {
  MastercardBrand,
  PaymentCard,
  type PaymentCardVariant,
  VisaBrand,
} from "../molecules/PaymentCard";
import { PreferencesTopBar } from "../molecules/PreferencesTopBar";
import {
  SecurityNavRow,
  SecurityToggleRow,
} from "../molecules/SecurityRow";
import {
  type CardBrand,
  type CreatePaymentCardInput,
  type PaymentCardDTO,
  formatExpiry,
  usePaymentCards,
} from "../../lib/payments/client";

const SectionTitle = ({ children }: { children: string }) => (
  <h3 className="text-[15px] font-semibold text-tertiary">{children}</h3>
);

const renderBrand = (brand: CardBrand) => {
  if (brand === "VISA") return <VisaBrand />;
  if (brand === "MASTERCARD") return <MastercardBrand />;
  return <span>CARTE</span>;
};

const variantFor = (index: number): PaymentCardVariant =>
  index % 2 === 0 ? "dark" : "primary";

export const PaymentsDashboard = () => {
  const router = useRouter();
  const { cards, hydrated, error, addCard, removeCard } = usePaymentCards();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<PaymentCardDTO | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shareFees, setShareFees] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleAdd = async (input: CreatePaymentCardInput) => {
    await addCard(input);
  };

  const requestDelete = (card: PaymentCardDTO) => {
    setDeleteError(null);
    setCardToDelete(card);
  };

  const cancelDelete = () => {
    if (deletePending) return;
    setCardToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    setDeletePending(true);
    setDeleteError(null);
    try {
      await removeCard(cardToDelete.id);
      setCardToDelete(null);
    } catch {
      setDeleteError("Suppression impossible. Réessaie.");
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PreferencesTopBar
        title="Paiements & Sécurité"
        onBack={() => router.back()}
        rightAction={
          <button
            type="button"
            onClick={openDialog}
            aria-label="Ajouter un moyen de paiement"
            className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            <PlusIcon className="size-4" />
          </button>
        }
      />

      <header>
        <h2 className="text-3xl font-serif leading-tight text-tertiary">
          Vos moyens
          <br />
          de paiement.
        </h2>
      </header>

      <section className="flex flex-col gap-3">
        <SectionTitle>Cartes enregistrées</SectionTitle>

        {error && (
          <p className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm text-primary">
            {error}
          </p>
        )}

        {hydrated && !error && cards.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500">
            Aucune carte enregistrée.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {cards.map((c, i) => (
            <PaymentCard
              key={c.id}
              variant={variantFor(i)}
              brand={renderBrand(c.brand)}
              last4={c.last4}
              holder={c.holder}
              expiry={formatExpiry(c.expMonth, c.expYear)}
              badge={i === 0 && cards.length > 1 ? "Par défaut" : undefined}
              onDelete={() => requestDelete(c)}
            />
          ))}
        </div>

        <AddPaymentMethodButton onClick={openDialog} />
      </section>

      <section className="flex flex-col gap-3 border-t border-neutral-200 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <SectionTitle>Partage des frais</SectionTitle>
            <p className="mt-1 text-[12px] leading-snug text-neutral-500">
              Demander automatiquement le partage avec les amis de la Wishlist
            </p>
          </div>
          <ToggleSwitch
            checked={shareFees}
            onChange={setShareFees}
            ariaLabel="Activer le partage des frais"
          />
        </div>
        {shareFees && (
          <InfoBanner tone="success">
            Chaque ami recevra une demande de paiement lors de la confirmation.
          </InfoBanner>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-neutral-200 pt-5 pb-8">
        <SectionTitle>Sécurité</SectionTitle>
        <SecurityNavRow
          href="/account/personal"
          icon={<LockIcon className="size-5" />}
          label="Changer le mot de passe"
        />
        <SecurityToggleRow
          icon={<FingerprintIcon className="size-5" />}
          label="Face ID / Touch ID"
          trailing={
            <ToggleSwitch
              checked={biometrics}
              onChange={setBiometrics}
              ariaLabel="Activer la biométrie"
            />
          }
        />
      </section>

      <AddPaymentCardDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleAdd}
      />

      <ConfirmDialog
        open={cardToDelete !== null}
        title="Supprimer ce moyen de paiement ?"
        description={
          cardToDelete
            ? `${cardToDelete.brand === "CARD" ? "Carte" : cardToDelete.brand} •••• ${cardToDelete.last4} — ${cardToDelete.holder}.${
                deleteError ? `\n\n${deleteError}` : ""
              }`
            : undefined
        }
        confirmLabel="Supprimer"
        tone="danger"
        pending={deletePending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};
