'use client';

export function DataRoomManager({ listingId, files, canManage }: { listingId: string; files: { id: string; filename: string; size: number }[]; canManage: boolean }) {
  async function upload(formData: FormData) {
    await fetch(`/api/dataroom/${listingId}/upload`, { method: 'POST', body: formData });
    location.reload();
  }

  async function remove(id: string) {
    await fetch(`/api/dataroom/file/${id}/delete`, { method: 'POST' });
    location.reload();
  }

  return (
    <div className="space-y-3">
      {canManage && (
        <form action={upload} className="rounded border p-3">
          <input type="file" name="file" required />
          <button className="ml-2 rounded bg-slate-900 px-3 py-1 text-white">Upload</button>
        </form>
      )}
      <div className="space-y-2">
        {files.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded border p-2">
            <a className="text-blue-700 underline" href={`/api/dataroom/file/${f.id}`}>{f.filename} ({Math.round(f.size/1024)} KB)</a>
            {canManage && <button onClick={() => remove(f.id)} className="text-sm text-red-700">Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
