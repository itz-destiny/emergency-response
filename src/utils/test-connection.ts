import { createClient } from '@supabase/supabase-js'

export async function testSupabaseConnection() {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are not set')
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Test 1: Basic Connection - Try to fetch system time
    console.log('🔄 Testing basic connection...')
    const { data: timeData, error: timeError } = await supabase.rpc('now')
    if (timeError) throw new Error(`Basic connection failed: ${timeError.message}`)
    console.log('✅ Basic connection successful! Server time:', timeData)

    // Test 2: Database Query - Try to count messages
    console.log('🔄 Testing database query...')
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
    if (countError) throw new Error(`Database query failed: ${countError.message}`)
    console.log('✅ Database query successful! Message count:', count)

    // Test 3: Real-time Connection
    console.log('🔄 Testing real-time connection...')
    const channel = supabase.channel('test')
    const subscription = channel
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Real-time connection successful!')
        subscription.unsubscribe()
      })
      .subscribe()

    return {
      success: true,
      message: 'All connection tests passed successfully!'
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error
    }
  }
}
