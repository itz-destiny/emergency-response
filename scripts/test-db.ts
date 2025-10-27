import { testSupabaseConnection } from '../src/utils/test-connection'

async function runTest() {
  console.log('🚀 Starting Supabase connection tests...\n')
  
  const result = await testSupabaseConnection()
  
  console.log('\n📝 Test Results:')
  console.log('----------------')
  console.log('Status:', result.success ? '✅ Passed' : '❌ Failed')
  console.log('Message:', result.message)
  
  if (!result.success) {
    process.exit(1)
  }
}

runTest()
