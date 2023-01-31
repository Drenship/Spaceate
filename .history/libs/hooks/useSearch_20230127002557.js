import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

export default function useSearch(query, pageNumber = 0) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [results, setResults] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setResults([])
    }, [query])


    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel

        axios({
            method: 'GET',
            url: '/api/search',
            params: { search: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setResults(res.data)
            setHasMore(res.data.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setLoading(false)
            setError(true)
        })
        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, results, hasMore }
}