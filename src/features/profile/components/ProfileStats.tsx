const stats = [
  {
    label: "시험까지",
    value: "D-14",
    accent: true,
  },
  {
    label: "완료한 학습",
    value: "8개",
    accent: false,
  },
  {
    label: "연속 학습",
    value: "5일",
    accent: false,
  },
];

export default function ProfileStats() {
  return (
    <div className="grid grid-cols-3 gap-3 shrink-0">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-1.5 rounded-2xl p-5"
          style={{ background: "#2d2d2d" }}
        >
          <span className="text-white/50 text-xs">{stat.label}</span>
          <span
            className="text-2xl font-bold"
            style={{ color: stat.accent ? "var(--color-brand-green-400)" : "#fff" }}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
