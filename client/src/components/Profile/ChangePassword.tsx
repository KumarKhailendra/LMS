import React, { FC, useEffect, useState } from 'react'
import { styles } from '@/styles/style';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

type Props = {}

const ChangePassword: FC<Props> = () => {
    const [show, setShow] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();


    const passwordChangeHandler = async (e: any) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            await updatePassword({ oldPassword, newPassword })
        } else {
            toast.error("Passwords do not match");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(`Password Changed successfully!`)
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            } else {
                toast.error(`An error occured ${error}`);
            }
        }
    }, [isSuccess, error]);

    return (
        <div className='w-full pl-7 px-2 800px:px-5 800px:pl-0'>
            <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">Change Password</h1>
            <div className="w-full">
                <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
                    <div className="w-[100%] 800px:w-[60%] mt-5 relative">
                        <label htmlFor="" className="block pb-2 text-black dark:text-[#fff]">Enter your old password</label>
                        <input
                            type={!show ? "password" : "text"}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        {
                            !show ? (
                                <AiOutlineEyeInvisible
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(false)}
                                />
                            )
                        }
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-2 relative">
                        <label htmlFor="" className="block pb-2 text-black dark:text-[#fff]">Enter your new password</label>
                        <input
                            type={!show ? "password" : "text"}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {
                            !show ? (
                                <AiOutlineEyeInvisible
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(false)}
                                />
                            )
                        }
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-2 relative">
                        <label htmlFor="" className="block pb-2 text-black dark:text-[#fff]">Enter your confirm password</label>
                        <input
                            type={!show ? "password" : "text"}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {
                            !show ? (
                                <AiOutlineEyeInvisible
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-[2] cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='absolute 800px:bottom-3 bottom-7 right-9 z-[2] cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(false)}
                                />
                            )
                        }
                    </div>
                    <div className="w-[100%] 800px:w-[60%]">
                        <input
                            className={`w-[95%] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                            required
                            value={"Update"}
                            type='submit'
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword