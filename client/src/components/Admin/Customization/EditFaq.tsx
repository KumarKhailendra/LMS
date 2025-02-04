import Loader from '@/components/Loader/Loader';
import { useCreateHeroLayoutMutation, useEditHeroLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { styles } from '@/styles/style';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';

type Props = {}

const EditFaq = (props: Props) => {
    const { data, refetch } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true
    });

    const [createHeroLayout, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, error: errorCreate }] = useCreateHeroLayoutMutation();
    const [editHeroLayout, { isLoading: isLoadingEdit, isSuccess: isSuccessEdit, error: errorEdit }] = useEditHeroLayoutMutation();


    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions([...data?.layout?.faq ?? '']);
        }

        if (isSuccessCreate || isSuccessEdit) {
            refetch();
            toast.success(isSuccessEdit ? "FAQ updated successfully" : "FAQ created successfully");
        }

        if (errorCreate || errorEdit) {
            if (errorCreate && 'data' in errorCreate) {
                const errorData = errorCreate as any;
                toast.error(errorData?.data?.message);
            }
            if (errorEdit && 'data' in errorEdit) {
                const errorData = errorEdit as any;
                toast.error(errorData?.data?.message);
            }
        }

    }, [data, isSuccessCreate, isSuccessEdit, errorCreate, errorEdit, refetch]);

    const toggleQuestion = (id: any) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((faq: any) =>
                faq._id === id ? { ...faq, active: !faq.active } : faq
            )
        );
    }

    const handleQuestionChange = (id: any, value: any) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((faq: any) =>
                faq._id === id ? { ...faq, question: value } : faq
            )
        );
    }

    const handleAnswerChange = (id: any, value: any) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((faq: any) =>
                faq._id === id ? { ...faq, answer: value } : faq
            )
        );
    }

    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                answer: ""
            }
        ]);
    }

    const areQuestionsUnchanged = (
        originalQuestions: any[],
        newQuestions: any[]
    ) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (questions: any[]) => {
        return questions.some((faq: any) => !faq.question || !faq.answer);
    };

    const handleEdit = async () => {

        if (data && Array.isArray(data.layout?.faq) && data.layout.faq.length > 0) {
            editHeroLayout({
                type: "FAQ",
                faq: questions
            });
        } else {
            createHeroLayout({
                type: "FAQ",
                faq: questions
            });
        }

    }

    return (
        <>
            {
                isLoadingCreate || isLoadingEdit ? (
                    <Loader />
                ) : (
                    <div className='w-[90%] 800px:w-[80%] m-auto mt-[120px]'>
                        <div className="mt-12">
                            <dl className='space-y-8'>
                                {questions?.map((faq: any, index: number) => (
                                    <div key={index} className={`${faq._id !== questions[0]?._id && "border-t"
                                        } border-gray-200 pt-6`}>
                                        <dt className='text-lg'>
                                            <button className='flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none'
                                                onClick={() => toggleQuestion(faq._id)}>
                                                <input
                                                    type="text"
                                                    className={`${styles.input} border-none`}
                                                    onChange={(e: any) => handleQuestionChange(faq._id, e.target.value)}
                                                    value={faq.question}
                                                    placeholder={"Add your question..."}
                                                />
                                                <span className='ml-6 flex-shrink-0'>
                                                    {
                                                        faq.active ? (
                                                            <AiOutlineMinus className='h-7 w-7 cursor-pointer' />
                                                        ) : (
                                                            <AiOutlinePlus className='h-7 w-7 cursor-pointer' />
                                                        )
                                                    }
                                                </span>
                                            </button>
                                        </dt>
                                        {
                                            faq.active && (
                                                <dd className='mt-2 pr-12'>
                                                    <input
                                                        value={faq.answer}
                                                        className={`${styles.input} border-none`}
                                                        onChange={(e: any) => handleAnswerChange(faq._id, e.target.value)}
                                                        placeholder={"Add your answer..."}
                                                    />
                                                    <span className='ml-6 flex-shrink-0'>
                                                        <AiOutlineDelete
                                                            className='dark:text-white text-black text-[18px] cursor-pointer'
                                                            onClick={() => {
                                                                setQuestions((precQuestion) => precQuestion.filter((item) => item._id !== faq._id));
                                                            }}
                                                        />
                                                    </span>
                                                </dd>
                                            )
                                        }
                                    </div>
                                ))}
                            </dl >
                            <br />
                            <br />
                            <IoMdAddCircleOutline
                                className='dark:text-white text-black text-[25px] cursor-pointer'
                                onClick={newFaqHandler}
                            />
                        </div >
                        <div className={`${styles.button} !w-[100px] !min-h-10 !h-10 dark:text-white text-black bg-[#cccccc34] ${areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions) ? "!cursor-not-allowed" : "!cursor-pointer !bg-[#42d383]"
                            } !rounded absolute bottom-12 right-12`}
                            onClick={areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions) ? () => null : handleEdit}
                        >Save</div>
                    </div >
                )
            }
        </>
    )
}

export default EditFaq