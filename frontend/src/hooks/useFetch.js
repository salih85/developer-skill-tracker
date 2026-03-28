import { useEffect, useState } from 'react'

const useFetch = (fn, dependencies = []) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fn()
        if (isActive) {
          setData(result)
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || 'Unable to load data')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      isActive = false
    }
  }, dependencies)

  return { data, loading, error }
}

export default useFetch
