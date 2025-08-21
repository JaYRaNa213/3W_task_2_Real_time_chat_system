export default function OnlineUsersList({ users }) {
  return (
    <div className="online-list">
      <div className="tag">Online ({users.length})</div>
      <div>
        {users.map(u => (
          <div key={u.id || u.username || u}>
            • {u.username || u}
          </div>
        ))}
      </div>
    </div>
  );
}
