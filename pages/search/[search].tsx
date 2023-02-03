import React from 'react'
import { NextPage } from 'next/types'
import { useRouter } from 'next/router'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'

const search: NextPage = () => {

    const router = useRouter()
    const { search } = router.query

    return (
        <BasescreenWrapper title={search} footer={true}>

        </BasescreenWrapper>
    )
}

export default search