export default function BreakingTicker({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="breaking">
      <span className="breaking__label">Breaking</span>
      <div className="breaking__marquee">
        {items.map((item) => (
          <span key={item.id} className="breaking__item">
            {item.title}
          </span>
        ))}
      </div>
    </div>
  );
}
