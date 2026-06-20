import { getUsersList } from "../actions";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const users = await getUsersList();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>
      
      <UsersTable initialUsers={users} />
    </div>
  );
}
