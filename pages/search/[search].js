import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import { useRouter } from 'next/router'
import React from 'react'

export default function search() {

    const router = useRouter()
    const { search } = router.query

    return (
        <BasescreenWrapper title={search}>

        </BasescreenWrapper>
    )
}
