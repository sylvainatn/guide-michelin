import { Chip } from "../atoms/Chip";
import { IconInput } from "../atoms/IconInput";
import { MailIcon, UserIcon } from "../atoms/icons";
import { FieldLabel } from "./FieldLabel";

const AGE_RANGES = [
  { label: "18–24 ans", min: 18, max: 24 },
  { label: "25–30 ans", min: 25, max: 30 },
  { label: "31–40 ans", min: 31, max: 40 },
  { label: "41–55 ans", min: 41, max: 55 },
  { label: "55+ ans", min: 56, max: 120 },
] as const;

const midOf = (r: (typeof AGE_RANGES)[number]) =>
  Math.min(60, Math.round((r.min + Math.min(r.max, 60)) / 2));

type Props = {
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  age: number | null;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPseudoChange: (value: string) => void;
  onAgeChange: (value: number) => void;
};

export const PersonalInfoSection = ({
  firstName,
  lastName,
  pseudo,
  email,
  age,
  onFirstNameChange,
  onLastNameChange,
  onPseudoChange,
  onAgeChange,
}: Props) => (
  <section className="border-b border-neutral-200 pb-5">
    <div className="mb-3 flex items-center gap-2">
      <h3 className="text-[15px] font-semibold text-tertiary">
        Informations personnelles
      </h3>
    </div>

    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="pref-firstname">Prénom</FieldLabel>
          <IconInput
            id="pref-firstname"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor="pref-lastname">Nom</FieldLabel>
          <IconInput
            id="pref-lastname"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="pref-pseudo">Pseudo</FieldLabel>
        <IconInput
          id="pref-pseudo"
          type="text"
          autoComplete="username"
          value={pseudo}
          onChange={(e) => onPseudoChange(e.target.value)}
          leadingIcon={<UserIcon className="size-5" />}
        />
      </div>

      <div>
        <FieldLabel htmlFor="pref-email">E-mail</FieldLabel>
        <IconInput
          id="pref-email"
          type="email"
          value={email}
          readOnly
          disabled
          leadingIcon={<MailIcon className="size-5" />}
        />
      </div>

      <div>
        <FieldLabel htmlFor="pref-age">Âge</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {AGE_RANGES.map((r) => {
            const selected = age !== null && age >= r.min && age <= r.max;
            return (
              <Chip
                key={r.label}
                selected={selected}
                onClick={() => onAgeChange(midOf(r))}
              >
                {r.label}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);
