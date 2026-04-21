export const DefinitionRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex justify-between gap-4">
    <dt className="text-neutral-500">{label}</dt>
    <dd className="font-medium">{value}</dd>
  </div>
);
