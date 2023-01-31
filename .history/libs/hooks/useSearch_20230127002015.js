import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../Context/UserContext';

export default function useVideosearch(query, pageNumber = 0) {
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
        let user = (userContext && userContext.token) ? { Authorization: 'Bearer ' + userContext.token } : {}

        axios({
            method: 'GET',
            url: '/api/search',
            params: { search: query, page: pageNumber },
            headers: user,
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