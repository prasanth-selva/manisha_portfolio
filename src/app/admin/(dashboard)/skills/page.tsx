import { CrudTable } from "@/components/admin/AdminUI";
import { deleteSkill, reorderSkills, saveSkill } from "@/lib/admin-actions";
import { getAdminRows } from "@/lib/admin-data";
import type { Skill } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const rows = await getAdminRows<Skill>("manisha_skills", "sort_order");
  return (
    <CrudTable
      title="Skills"
      rows={rows}
      primaryKey="name"
      saveAction={saveSkill}
      deleteAction={deleteSkill}
      reorderAction={reorderSkills}
      fields={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category (Core/Defense/Offense/Build)" },
        { name: "level", label: "Level (1–100)", type: "number" },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "published", label: "Published", type: "checkbox" },
      ]}
    />
  );
}
