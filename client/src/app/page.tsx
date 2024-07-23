'use client';
import Header from "@/components/Header";
import Hero from "@/components/HeroSection/Hero";
import Heading from "@/utils/Heading";
import React, {FC, useState} from "react";


interface Props {}

const Page: FC<Props> = (props) =>{
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveIiem] = useState(0);
  const [route, setRoute] = useState('Login');

  return (
    <div>
      <Heading 
        title="LMS"
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
      <Hero />
    </div>
  )
}

export default Page;