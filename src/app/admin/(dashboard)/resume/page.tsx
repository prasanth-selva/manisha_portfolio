import { ResumeUploader } from "@/components/admin/ResumeUploader";
import { getAdminSettings } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const settings = await getAdminSettings();
  return <ResumeUploader currentUrl={settings.resumeUrl} />;
}
