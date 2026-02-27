export function RoleBadge({ role }: { role: string }) {
  return <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">{role}</span>;
}
