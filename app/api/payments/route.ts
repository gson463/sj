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
    const { order_id, amount, payment_method } = body

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Record the payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id,
        user_id: user.id,
        amount,
        payment_method,
        transaction_ref: `TXN-${Date.now()}`,
        status: 'completed'
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 400 })
    }

    // Update order amount_paid
    const newAmountPaid = Number(order.amount_paid) + Number(amount)
    const newStatus = newAmountPaid >= Number(order.total_price) ? 'paid' : 'partial'

    await supabase
      .from('orders')
      .update({ 
        amount_paid: newAmountPaid,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)

    // Update wallet balance if exists
    await supabase
      .from('customer_wallets')
      .update({ 
        current_balance: newAmountPaid,
        status: newStatus === 'paid' ? 'completed' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', order_id)

    // Create notification
    const notificationMessage = newStatus === 'paid'
      ? 'Congratulations! You have completed your payment. Your phone is ready for pickup/delivery!'
      : `Payment of TZS ${amount.toLocaleString()} received. New balance: TZS ${newAmountPaid.toLocaleString()}`

    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: newStatus === 'paid' ? 'Payment Complete!' : 'Payment Received',
        message: notificationMessage,
        type: 'payment'
      })

    return NextResponse.json({ 
      success: true, 
      payment,
      order_status: newStatus,
      new_balance: newAmountPaid
    })
  } catch (error) {
    console.error('Payment API error:', error)
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

    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          id,
          total_price,
          products (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
