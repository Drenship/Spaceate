import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import { NextPage } from 'next';
import React from 'react';

interface Props {
    
}

const UserProfil: NextPage<Props> = ({}) => {

    return (
        <BasescreenWrapper title="Profile" footer={true}>

            

        </BasescreenWrapper>
    );
}

export const getServerSideProps = async () => {

    const defaultReturn = {
        props: {},
    }

    try {
        return {
            props: {},
        }
    } catch (err) {
        return defaultReturn
    }
}

UserProfil.auth = true;
export default UserProfil