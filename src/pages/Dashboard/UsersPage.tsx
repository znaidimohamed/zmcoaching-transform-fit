import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, Search, Pencil } from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const updateProfile = async () => {
    await api.put(`/users/${selectedUser.id}/profile`, selectedUser);
    setSelectedUser(null);
    fetchUsers();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold uppercase text-xs">
          User management
        </p>
        <h1 className="text-4xl font-black mt-2">
          Utilisateurs <span className="text-red-500">Dashboard</span>
        </h1>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="w-full rounded-2xl bg-black/60 border border-white/10 pl-11 pr-4 py-3 outline-none focus:border-red-500"
        />
      </div>

      {/* USERS GRID */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <h3 className="text-xl font-bold">{user.fullName}</h3>
              <p className="text-zinc-400 text-sm">{user.email}</p>

              <div className="mt-4 text-sm text-zinc-400 space-y-1">
                <p>Age: {user.age || "-"}</p>
                <p>Height: {user.height || "-"} cm</p>
                <p>Weight: {user.weight || "-"} kg</p>
                <p>Goal: {user.goal || "-"}</p>
              </div>

              <button
                onClick={() => setSelectedUser(user)}
                className="mt-5 w-full bg-red-600 py-2 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Pencil size={16} />
                Modifier Profil
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">
              Edit {selectedUser.fullName}
            </h2>

            <input
              placeholder="Age"
              type="number"
              value={selectedUser.age || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  age: Number(e.target.value),
                })
              }
              className="w-full p-3 rounded bg-black border"
            />

            <input
              placeholder="Height (cm)"
              type="number"
              value={selectedUser.height || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  height: Number(e.target.value),
                })
              }
              className="w-full p-3 rounded bg-black border"
            />

            <input
              placeholder="Weight (kg)"
              type="number"
              value={selectedUser.weight || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  weight: Number(e.target.value),
                })
              }
              className="w-full p-3 rounded bg-black border"
            />

            <input
              placeholder="Goal"
              value={selectedUser.goal || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  goal: e.target.value,
                })
              }
              className="w-full p-3 rounded bg-black border"
            />

            <select
              value={selectedUser.activityLevel || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  activityLevel: e.target.value,
                })
              }
              className="w-full p-3 rounded bg-black border"
            >
              <option value="">Activity Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              placeholder="Phone"
              value={selectedUser.phone || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  phone: e.target.value,
                })
              }
              className="w-full p-3 rounded bg-black border"
            />

            <div className="flex gap-3">
              <button
                onClick={updateProfile}
                className="flex-1 bg-red-600 py-3 rounded-xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-white/10 py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;