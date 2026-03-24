export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-zinc-900 via-black to-zinc-800">
      {/* overlay pra dar contraste */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
