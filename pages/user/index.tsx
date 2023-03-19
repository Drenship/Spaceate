import React from 'react';
import { NextPage } from 'next';
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import { PDFViewer } from '@react-pdf/renderer';
import Invoice from '@components/ui-ux/DocumentsPDF/Invoice';

interface Props {

}

const UserProfil: NextPage<Props> = ({ }) => {


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