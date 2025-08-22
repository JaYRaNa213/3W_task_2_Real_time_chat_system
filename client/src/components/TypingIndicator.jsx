export default function TypingIndicator({ typing }) {
  if (!typing?.length) return null;
  const text = typing.length === 1 ? `${typing[0]} is typing...` : "Several people are typing...";
  return <div className="tag" style={{ padding: "4px 16px" }}>{text}</div>;
}
