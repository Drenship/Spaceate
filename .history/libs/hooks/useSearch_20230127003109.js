import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useSearch(query, pageNumber = 0) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [results, setResults] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => { setResults([]) }, [query])


    

    useEffect(async () => {
        
        try {
            setLoading(true)
            setError(false)
            let cancel;

            const { data } = await axios({
                method: 'GET',
                url: '/api/search',
                params: { search: query, page: pageNumber },
                cancelToken: new axios.CancelToken(c => cancel = c)
            })

            setResults(data)
            setHasMore(data.length > 0)
            setLoading(false)
            
        } catch (error) {
            if (axios.isCancel(error)) return
            setLoading(false)
            setError(true)
        }

        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, results, hasMore }
}