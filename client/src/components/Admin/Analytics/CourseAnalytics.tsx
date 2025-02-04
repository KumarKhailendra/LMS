import Loader from '@/components/Loader/Loader';
import { useGetCourseAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import { styles } from '@/styles/style';
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Label, LabelList } from 'recharts';

type Props = {}

const CourseAnalytics = (props: Props) => {

    const {data, isLoading} = useGetCourseAnalyticsQuery({});

    const analyticsData: any = [];
    const minValue = 0;

    data && data.courses?.last12Months?.forEach((item: any) => {
        analyticsData.push({name: item.month, uv: item.count})
    })
    

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ):(
                    <div className="h-screen">
                        <div className="mt-12">
                            <h1 className={`${styles.title} px-5 !text-start`}>
                                Courses Analytics
                            </h1>
                            <p className={`${styles.label} px-5`}>
                                Last 12 months analytics data(&quot; &quot;)
                            </p>
                        </div>
                        <div className="w-full h-[90%] flex justify-center items-center">
                            <ResponsiveContainer width={"90%"} height={"50%"}>
                                <BarChart width={150} height={300} data={analyticsData}>
                                    <XAxis dataKey={"name"}>
                                        <Label offset={0} position={"insideBottom"} />
                                    </XAxis >
                                    <YAxis domain={[minValue, "auto"]} />
                                    <Bar dataKey={"uv"} fill="#3faf82">
                                        <LabelList dataKey={"uv"} position={"top"} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CourseAnalytics