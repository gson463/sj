import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: wallets, error } = await supabase
      .from('customer_wallets')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          images,
          price
        ),
        orders (
          id,
          status,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error('Get wallets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
