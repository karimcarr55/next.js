// This route intentionally produces EMPTY build-time shells: the params are
// read outside of any Suspense boundary, so the postpone propagates to the
// root and none of the shells contain static content. `instant = false` opts
// the route out of requiring an instant (non-empty) shell.
//
// `generateStaticParams` never provides `id`, so `id` must never be resolved
// into a cached shell and must never be part of a cache key: only `lang` and
// `category` can be completed into more specific shells on demand.
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'en', category: 'shoes' }]
}

export const instant = false

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string; id: string }>
}) {
  const { lang, category, id } = await params

  // A per-render marker that is still prerenderable (unlike dynamic IO).
  // It's read after `await params`, so it renders in the deferred region:
  // responses must re-render (resume) this region per request, so the
  // marker must never repeat across fetches. A repeated value means a
  // stored render is being replayed from the cache.
  const renderedAt = performance.now()

  return (
    <div>
      <div id="lang">{lang}</div>
      <div id="category">{category}</div>
      <div id="id">{id}</div>
      <div id="rendered-at">{renderedAt}</div>
    </div>
  )
}
