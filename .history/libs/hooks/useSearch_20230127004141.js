import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useSearch(query, pageNumber = 0) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [results, setResults] = useState([])
    const [hasMore, setHasMore] = useState(false)
    let cancel;

    const research = async () => {
        try {
            setLoading(true)
            setError(false)
    
            const { data } = await axios({
                method: 'GET',
                url: '/api/search',
                params: { search: query, page: pageNumber },
                cancelToken: new axios.CancelToken(c => cancel = c)
            })
    
            setLoading(false)
            setResults(data)
            setHasMore(data.length > 0)
        } catch (error) {
            if (axios.isCancel(error)) return
            setLoading(false)
            setError(true)
        }
    }

    useEffect(() => {
        research()
        return () => cancel()
    }, [query, pageNumber])

    useEffect(() => { setResults([]) }, [query])

    return { loading, error, results, hasMore }
}