export default function ProductSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="h-[280px] rounded-2xl bg-slate-100" />
      <div className="h-[400px] rounded-2xl bg-slate-100" />
    </div>
  );
}