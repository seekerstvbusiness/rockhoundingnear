import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, subject, message } = body as Record<string, unknown>

  if (
    typeof name !== 'string' || name.trim().length < 1 ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== 'string' || message.trim().length < 1
  ) {
    return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 422 })
  }

  const { error } = await supabase.from('contact_submissions').insert([{
    name: name.trim().slice(0, 200),
    email: email.trim().slice(0, 200),
    subject: typeof subject === 'string' ? subject.trim().slice(0, 200) : null,
    message: message.trim().slice(0, 5000),
  }])

  if (error) {
    console.error('contact insert error:', error)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
