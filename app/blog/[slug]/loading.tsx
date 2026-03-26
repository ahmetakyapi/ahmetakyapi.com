export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto animate-pulse">
        {/* Tag */}
        <div className="h-5 w-20 rounded-full bg-white/5 mb-4" />
        {/* Title */}
        <div className="h-10 w-3/4 rounded-lg bg-white/5 mb-3" />
        {/* Meta */}
        <div className="h-4 w-48 rounded bg-white/5 mb-10" />
        {/* Content lines */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-5/6 rounded bg-white/5" />
          <div className="h-4 w-4/5 rounded bg-white/5" />
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-3/4 rounded bg-white/5" />
        </div>
      </div>
    </div>
  )
}
