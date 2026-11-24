import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminSettings } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  return <SettingsForm settings={settings} />;
}
