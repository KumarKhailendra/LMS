'use client';
import Header from '@/components/Header'
import Protected from '@/hooks/useProtected'
import Heading from '@/utils/Heading'
import React, { FC, useState } from 'react'
import Profile from '@/components/Profile/Profile'
import { useSelector } from 'react-redux';

type Props = {}

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveIiem] = useState(0);
    const [route, setRoute] = useState('Login');
    const {user} = useSelector((state:any)=> state.auth);

    return (
        <>
            <Protected>
                <Heading
                    title={`${user?.name} Profile - LMS`}
                    description="LMS is a platform for student to learn and get help from teachers"
                    keywords="Programing, MERN, Redux, Machine Learning"
                />
                <Header
                    open={open}
                    setOpen={setOpen}
                    activeItem={activeItem}
                    route={route}
                    setRoute={setRoute}
                />
                <Profile user={user} />
            </Protected>
        </>
    )
}

export default Page