import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      product_id, 
      payment_type, 
      total_price, 
      initial_payment,
      delivery_method,
      delivery_address,
      notes 
    } = body

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        product_id,
        payment_type,
        total_price,
        amount_paid: payment_type === 'cash' ? total_price : initial_payment || 0,
        status: payment_type === 'cash' ? 'paid' : 'partial',
        delivery_method,
        delivery_address,
        notes
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    // If it's a Lipa Kidogo Kidogo order, create a wallet entry
    if (payment_type === 'lipa_kidogo') {
      const { error: walletError } = await supabase
        .from('customer_wallets')
        .insert({
          user_id: user.id,
          order_id: order.id,
          product_id,
          target_amount: total_price,
          current_balance: initial_payment || 0,
          status: 'active'
        })

      if (walletError) {
        console.error('Wallet creation error:', walletError)
      }
    }

    // Record the initial payment if any
    if (initial_payment && initial_payment > 0) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          user_id: user.id,
          amount: initial_payment,
          payment_method: body.payment_method || 'mpesa',
          transaction_ref: `TXN-${Date.now()}`,
          status: 'completed'
        })

      if (paymentError) {
        console.error('Payment recording error:', paymentError)
      }
    }

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: payment_type === 'cash' ? 'Order Confirmed!' : 'Savings Plan Started!',
        message: payment_type === 'cash' 
          ? 'Your order has been placed successfully. We will process it shortly.'
          : `You have started saving for your phone. Your current balance is TZS ${(initial_payment || 0).toLocaleString()}.`,
        type: 'order'
      })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          images,
          price
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
