import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/utils/Heading';
import Header from '../Header';
import Footer from '../Footer';
import CourseDetails from './CourseDetails';
import { useCreatePaymentIntentMutation, useGetStripePublishableKeyQuery } from '@/redux/features/orders/ordersApi';
import { loadStripe } from '@stripe/stripe-js';

type Props = {
    id: string;
}

const CourseDetailsPage: React.FC<Props> = ({ id }) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishableKeyQuery({});
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (config && config.publishableKey) {
            setStripePromise(loadStripe(config.publishableKey));
        }
        if (data && data.course) {
            createPaymentIntent({ amount: Math.round(data.course.price * 100) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, data])

    useEffect(() => {
        if (paymentIntentData && paymentIntentData.clientSecret) {
            setClientSecret(paymentIntentData.clientSecret);
        }
    }, [paymentIntentData])

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <Heading
                            title={`${data?.course?.name} - BuyLMS`}
                            description="LMS is a platform for student to learn and get help from teachers"
                            keywords={data?.course?.tags}
                        />
                        <Header
                            open={open}
                            setOpen={setOpen}
                            activeItem={1}
                            route={route}
                            setRoute={setRoute}
                        />
                        {
                            stripePromise && (
                                <CourseDetails
                                    data={data?.course}
                                    stripePromise={stripePromise}
                                    clientSecret={clientSecret}
                                />
                            )
                        }
                        <Footer />
                    </div>
                )
            }
        </>
    )
}

export default CourseDetailsPage