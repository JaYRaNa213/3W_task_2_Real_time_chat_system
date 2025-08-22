export default function OnlineUsersList({ users = [] }) {
  return (
    <div className="p-3 bg-gray-900 text-white rounded-xl shadow-md w-64">
      <div className="font-semibold text-sm mb-2">
        Online ({users.length})
      </div>
      <div className="space-y-1 text-sm">
        {users.length > 0 ? (
          users.map((u, i) => (
            <div
              key={u.id || u.username || i}
              className="flex items-center gap-2"
            >
              <span className="text-green-400">●</span>
              <span>{u.username || u}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 italic">No one online</div>
        )}
      </div>
    </div>
  );
}
