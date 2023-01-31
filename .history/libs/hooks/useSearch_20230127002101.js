import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

export default function useSearch(query, pageNumber = 0) {
    const userContext = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [videos, setVideos] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setVideos([])
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
            /*setVideos(prevVideos => {
                console.log(...res.data)
                //return [...new Set([...prevVideos, ...res.data])]
                return [...res.data]
            })*/

            setVideos(res.data)

            setHasMore(res.data.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [query, pageNumber, userContext])

    return { loading, error, videos, hasMore }
}