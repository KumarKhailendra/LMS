import { styles } from '@/styles/style'
import Image from 'next/image'
import React from 'react'
import ReviewCard from '../Review/ReviewCard'

type Props = {}

export const reviews = [
    {
        "name": "Jon Doe",
        "avatar": "https://randomuser.me/api/portraits/med/men/37.jpg",
        "profession": "Software Engineer",
        "rating": 5,
        "comment": "The service was excellent, and I really appreciate the effort put into meeting all the project requirements. The team was knowledgeable and maintained clear communication throughout the process. Highly recommended for anyone looking for reliable software development."
    },
    {
        "name": "Alice Johnson",
        "avatar": "https://randomuser.me/api/portraits/med/men/7.jpg",
        "profession": "Graphic Designer",
        "rating": 5,
        "comment": "Working with this team has been a fantastic experience! They were able to take my design concepts and elevate them to a whole new level. The attention to detail and creativity they brought to the table was truly outstanding. I’m already looking forward to collaborating with them again."
    },
    {
        "name": "Robert Smith",
        "avatar": "https://randomuser.me/api/portraits/med/women/86.jpg",
        "profession": "Product Manager",
        "rating": 5,
        "comment": "I’ve rarely come across such a dedicated and professional team. They tackled every challenge with expertise and delivered a product that far exceeded expectations. Their ability to manage time and resources effectively is commendable, and I’m thrilled with the outcome of our project."
    },
    {
        "name": "Emma Brown",
        "avatar": "https://randomuser.me/api/portraits/med/women/87.jpg",
        "profession": "UX Designer",
        "rating": 5,
        "comment": "The team demonstrated exceptional skills in user experience design. Their ability to understand user behavior and translate it into intuitive interfaces is second to none. They also maintained consistent communication, ensuring that all my inputs were incorporated seamlessly into the final product."
    },
    {
        "name": "Michael Davis",
        "avatar": "https://randomuser.me/api/portraits/med/men/1.jpg",
        "profession": "Full-Stack Developer",
        "rating": 5,
        "comment": "The entire process, from initial discussions to final delivery, was handled with remarkable professionalism. The team not only delivered the project ahead of schedule but also ensured that the code was clean and scalable. Their technical expertise and dedication truly impressed me."
    },
    {
        "name": "Sophia Wilson",
        "avatar": "https://randomuser.me/api/portraits/med/men/2.jpg",
        "profession": "Content Writer",
        "rating": 5,
        "comment": "I couldn’t be happier with the results! The team was receptive to all my suggestions and went above and beyond to deliver a high-quality product. Their expertise and commitment to excellence were evident at every stage of the project. This has been one of the best collaborations I’ve had."
    }
];



const Reviews = (props: Props) => {
    return (
        <div className='w-[90%] 800px:w-[85%] m-auto'>
            <div className="w-full 800px:flex items-start">
                <div className="800px:w-[50%] w-full">
                    <Image
                        src={require("../../../public/assets/trader-hero-banner.png")}
                        alt='business'
                        width={700}
                        height={700}
                    />
                </div>
                <div className="800px:w-[50%] w-full">
                    <h3 className={`${styles.title} 800px:!text-[40px]`}>
                        Our Students Are <span className='text-blue-400'>Our Strength</span>{" "}
                        <br /> See What They Say About Us
                    </h3>
                    <br />
                    <p className={styles.label}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&lsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>
                </div>
                <br />
                <br />
            </div>
            <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px]`}>
                {
                    reviews && reviews.map((review: any, index: number) => (
                        <ReviewCard item={review} key={index} />
                    ))
                }
            </div>
        </div>
    )
}

export default Reviews