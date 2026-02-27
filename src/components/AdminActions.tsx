'use client';

export function AdminListingActions({ id }: { id: string }) {
  return <div className="flex gap-2"><button className="rounded bg-green-700 px-2 py-1 text-white" onClick={async()=>{await fetch(`/api/admin/listings/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'APPROVED'})});location.reload();}}>Approve</button><button className="rounded bg-red-700 px-2 py-1 text-white" onClick={async()=>{await fetch(`/api/admin/listings/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'REJECTED'})});location.reload();}}>Reject</button></div>;
}

export function AdminVerificationActions({ id }: { id: string }) {
  return <div className="flex gap-2"><button className="rounded bg-green-700 px-2 py-1 text-white" onClick={async()=>{await fetch(`/api/admin/verifications/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'VERIFIED'})});location.reload();}}>Verify</button><button className="rounded bg-red-700 px-2 py-1 text-white" onClick={async()=>{await fetch(`/api/admin/verifications/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'REJECTED'})});location.reload();}}>Reject</button></div>;
}
