import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // TODO: Replace with a fetch/axios call to your backend REST API
  // await pool.query('UPDATE student_profiles SET selectionStatus = "failed" WHERE id = ?', [params.id]);
  return NextResponse.json({ error: 'Not implemented. Use backend API.' });
}
