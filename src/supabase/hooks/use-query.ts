import { useEffect, useState } from 'react'
import { useSupabase } from '../provider'
import { PostgrestError } from '@supabase/supabase-js'

export function useQuery<T>(
  tableName: string,
  query?: (query: any) => any,
  deps: any[] = []
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let queryBuilder = supabase.from(tableName).select('*')
        
        if (query) {
          queryBuilder = query(queryBuilder)
        }

        const { data: result, error } = await queryBuilder

        if (error) {
          setError(error)
          return
        }

        setData(result)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err as PostgrestError)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, error, loading }
}
