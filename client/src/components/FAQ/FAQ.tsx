import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { styles } from '@/styles/style';
import React, { useEffect, useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi';

type Props = {}

const FAQ = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([])
  const toggleQuestion = (index:any) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  useEffect(()=> {
    setQuestions(data?.layout?.faq)
  },[data]);

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%0 m-auto">
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>
        <div className="mt-12">
          <dl className="space-y-8">
            {
              questions && questions.map((question) => (
                <div key={question._id} className={
                  `${question._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`
                }>
                  <dt className="text-lg">
                    <button 
                    className='flex items-start justify-between w-full text-left focus:outline-none'
                    onClick={() => toggleQuestion(question._id)}
                    >
                      <span className='font-medium text-black dark:text-white'>
                        {question.question}
                      </span>
                      <span className='ml-6 flex-shrink-0'>
                        {
                          activeQuestion === question._id ? (
                            <HiMinus className='h-6 w-6 text-black dark:text-white' aria-hidden="true" />
                          ) : (
                            <HiPlus className='h-6 w-6 text-black dark:text-white' aria-hidden="true" />
                          )
                        }
                      </span>
                    </button>
                  </dt>
                  {
                    activeQuestion === question._id && (
                      <dd className='mt-2 pr-12'>
                        <p className='text-base font-Poppins text-black dark:text-white'>
                          {question.answer}
                        </p>
                      </dd>
                    )
                  }
                </div>
              ))
            }
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}

export default FAQ