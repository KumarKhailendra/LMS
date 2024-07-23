'use client';

import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { styles } from '@/styles/style';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import * as Yup from 'yup';

type Props = {
  setRoute: (route: any) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
})

const SignUp: FC<Props> = ({setRoute}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [register, {isError,data,isSuccess, isLoading, error}] = useRegisterMutation();

  useEffect(()=>{
    if(isSuccess){
      const message = data?.message || "Registration successful!";
      toast.success(message);
      setRoute("Verification");
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message);
      }else{
        toast.error(`An error occured ${error}`);
      }
    }
    if(isLoading){
      setLoading(true)
    }else{
      setLoading(false)
    }
    // if(isError){
    //   toast.error("something wents wrong");
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isSuccess, error, isLoading]);

  const formik = useFormik({
    initialValues: {name: "", email: "", password: ""},
    validationSchema: schema,
    onSubmit: async({name, email,password}) => {
      const data = {name, email,password};
      await register(data);
    }
  })

  const {errors, touched, values, handleChange, handleSubmit} = formik;
  
  return (
    <div className='w-full'>
      <h1 className={styles.title}>Join to BuyLMS</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className={styles.label}>Enter your Name</label>
            <input type='text' name="name" value={values.name} onChange={handleChange} id='name' placeholder='Jon Doe' className={`${
            errors.name && touched.name && "border-red-500"
            } ${styles.input}`} />
            {
            errors.name && touched.name && (
                <span className="text-red-500 pt-2 block">{errors.name}</span>
            )
            }
        </div>
        <div className="w-full mt-5 relative mb-1">
            <label htmlFor="email" className={styles.label}>Enter your Email</label>
            <input type='email' name="email" value={values.email} onChange={handleChange} id='email' placeholder='mail@example.com' className={`${
            errors.email && touched.email && "border-red-500"
            } ${styles.input}`} />
            {
            errors.email && touched.email && (
                <span className="text-red-500 pt-2 block">{errors.email}</span>
            )
            }
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={styles.label}>Enter Your Password</label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id='password'
            placeholder='Password!@#%'
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {
            !show ? (
              <AiOutlineEyeInvisible
                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                size={20}
                onClick={()=>setShow(true)}
              />
            ) : (
              <AiOutlineEye
                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                size={20}
                onClick={()=>setShow(false)}
              />
            )
          }
        </div>
          {
          errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )
        }
        <div className="w-full mt-5">
          <button type="submit" className={loading ? styles.loadingButton : styles.button} disabled={loading}>
            {loading ? <div className="spinner"></div> : "Sign Up"}
          </button>
        </div>
        <br/>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">Or join with</h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className='cursor-pointer mr-2' />
          <AiFillGithub size={30} className='cursor-pointer ml-2' />
        </div>
        <div className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?{" "}
          <span className='text-[#2190ff] pl-1 cursor-pointer' onClick={() => setRoute("Login")}>Sign In</span>
        </div>
      </form>
      <br/>
    </div>
  )
}

export default SignUp