import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className='w-[95%] md:w-[90%] 2xl:w-[85%] mx-auto flex flex-col md:flex-row items-center justify-center h-[90vh] relative z-20'>
      <div className='w-full md:w-1/2 flex items-center justify-center md:justify-end pt-10 md:pt-0'>
        <Image 
          src={require('../../../public/assets/trader-hero-banner-1.png')} 
          width={650} 
          height={650} 
          alt='trader-hero-banner' 
          className='object-contain' 
        />
      </div>
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-5 md:mt-0'>
        <h1 className='text-3xl md:text-5xl font-medium font-Poppins py-2 md:leading-tight text-black dark:text-white'>
          Start your 
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-300 dark:to-teal-200'> trading</span>
          <br />
          Journey with our 
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-300 dark:to-teal-200'> Dedicated community!</span>
        </h1>
        <p className='text-base md:text-lg leading-relaxed font-normal font-poppins text-gray-700 dark:text-gray-300 mb-5'>
          Begin your coding adventure in our community, where learning is always appreciated and valued.
        </p>
        <Link href='/' className='group relative flex justify-center items-center py-3 px-6 rounded-full bg-[#2190ff] text-white font-Poppins font-semibold w-[200px] text-[16px] min-h-[45px]'>
          Explore Resources
        </Link>
      </div>
    </div>
  );
};

export default Hero;
