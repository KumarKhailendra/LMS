import React, { FC } from 'react'
import { navItemsData } from './lmsNavData';
import Link from 'next/link';

type Props = {
    activeItem: number;
    isMobile: boolean;
}

const NavItems: FC<Props> = ({activeItem, isMobile}) => {
  return (
    <>
        <div className="hidden 800px:flex">
            {navItemsData && navItemsData.map((i, index) => (
                <Link href={`${i.url}`} key={index} passHref>
                    <span className={`${
                        activeItem === index
                            ? "dark:text-[#37a39a] text-[crimson]"
                            : "dark:text-white text-black"
                        } text-[18px] px-6 font-Poppins font-[400]`}>
                        {i.name}
                    </span>
                </Link>
            ))}
        </div>
        {isMobile && (
            <div className="800px:hidden mt-5">
                <div className="w-full text-center py-6">
                    <Link href='/' className="text-[25px] font-Poppins font-[500] text-black dark:text-white" passHref>
                        BuyLMS
                    </Link>
                </div>
                    {navItemsData && navItemsData.map((item, index) => (
                        <Link href={item.url} key={index} passHref>
                            <span className={`${
                                activeItem === index
                                    ? "dark:text-[#37a39a] text-[crimson]"
                                    : "dark:text-white text-black"
                                } block py-5 text-[18px] px-6 font-Poppins font-[400]`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
            </div>
        )}
    </>
  )
}

export default NavItems
