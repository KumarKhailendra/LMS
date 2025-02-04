'use client';
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/HeroSection/Hero";
import Courses from "@/components/Route/Courses";
import Reviews from "@/components/Route/Reviews";
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
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  )
}

export default Page;