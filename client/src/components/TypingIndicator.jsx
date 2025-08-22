import { motion } from "framer-motion";

export default function TypingIndicator({ typing }) {
  if (!typing?.length) return null;

  const text =
    typing.length === 1
      ? `${typing[0]} is typing...`
      : typing.length === 2
      ? `${typing[0]} and ${typing[1]} are typing...`
      : `${typing[0]}, ${typing[1]} and others are typing...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-full shadow-md w-fit">
      <span className="text-sm">{text}</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
