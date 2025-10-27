import { useState } from 'react'
import { useSupabase } from '../provider'
import { PostgrestError } from '@supabase/supabase-js'

type MutationOptions = {
  onSuccess?: (data: any) => void
  onError?: (error: PostgrestError) => void
}

export function useMutation(
  tableName: string,
  options: MutationOptions = {}
) {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const insert = async (data: any) => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()

      if (error) {
        setError(error)
        options.onError?.(error)
        return null
      }

      options.onSuccess?.(result)
      return result
    } catch (err) {
      console.error('Error inserting data:', err)
      const pgError = err as PostgrestError
      setError(pgError)
      options.onError?.(pgError)
      return null
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string | number, data: any) => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()

      if (error) {
        setError(error)
        options.onError?.(error)
        return null
      }

      options.onSuccess?.(result)
      return result
    } catch (err) {
      console.error('Error updating data:', err)
      const pgError = err as PostgrestError
      setError(pgError)
      options.onError?.(pgError)
      return null
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string | number) => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        setError(error)
        options.onError?.(error)
        return null
      }

      options.onSuccess?.(result)
      return result
    } catch (err) {
      console.error('Error deleting data:', err)
      const pgError = err as PostgrestError
      setError(pgError)
      options.onError?.(pgError)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    insert,
    update,
    remove,
    loading,
    error
  }
}
