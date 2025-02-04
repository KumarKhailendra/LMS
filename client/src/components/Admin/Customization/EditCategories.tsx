import Loader from '@/components/Loader/Loader';
import { useCreateHeroLayoutMutation, useEditHeroLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { styles } from '@/styles/style';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';

type Props = {}

const EditCategories = (props: Props) => {
    const { data, refetch } = useGetHeroDataQuery("Categories", {
        refetchOnMountOrArgChange: true
    });
    const [createHeroLayout, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, error: errorCreate }] = useCreateHeroLayoutMutation();
        const [editHeroLayout, { isLoading: isLoadingEdit, isSuccess: isSuccessEdit, error: errorEdit }] = useEditHeroLayoutMutation();

    const [categories, setCategories] = useState<any>([])

    useEffect(() => {
        if (data) {
            setCategories([...data?.layout?.categories ?? '']);
        }

        if (isSuccessCreate || isSuccessEdit) {
            refetch();
            toast.success("Hero updated successfully");
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
    }, [data, isSuccessCreate, isSuccessEdit, errorCreate, errorEdit, refetch])

    const handleCategoriesAdd = (id: any, value: any) => {
        setCategories((prevCategories: any) =>
            prevCategories.map((category: any) =>
                category._id === id ? { ...category, title: value } : category
            )
        );
    }

    const newCategoriesHandler = () => {
        if (categories.length > 0 && categories[categories.length - 1].title === "") {
            toast.error("Please fill the previous category title");
        } else {
            setCategories([
                ...categories,
                {
                    title: ""
                }
            ]);
        }
    }

    const areCategoriesUnchanged = (
        originalCategories: any[],
        newCategories: any[]
    ) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoriesTitleEmpty = (categories: any[]) => {
        return categories.some((category: any) => !category.title);
    }

    const handleCategoriesEdit = () => {
        if (data && Array.isArray(data.layout?.categories) && data.layout.categories.length > 0) {
            if(!areCategoriesUnchanged(data?.layout?.categories, categories) && !isAnyCategoriesTitleEmpty(categories)){
                editHeroLayout({
                    type: "Categories",
                    categories
                });
            }
        } else {
            createHeroLayout({
                type: "Categories",
                categories
            });
        }
    }

    return (
        <>
            {
                isLoadingCreate || isLoadingEdit ? (
                    <Loader />
                ) : (
                    <div className='mt-[120px] text-center'>
                        <h1 className={`${styles.title}`}>All Categories</h1>
                        {
                            categories && categories.map((category: any, index: number) => {
                                return (
                                    <div className="p-3" key={index}>
                                        <div className="flex items-center w-full justify-center">
                                            <input
                                                type="text"
                                                className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                                                value={category.title}
                                                onChange={(e) => handleCategoriesAdd(category._id, e.target.value)}
                                                placeholder='Enter category title...'
                                            />
                                            <AiOutlineDelete
                                                className='dark:text-white text-black text-[18px] cursor-pointer'
                                                onClick={() => {
                                                    setCategories((prevCategories: any) =>
                                                        prevCategories.filter((item: any) => item._id !== category._id)
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <br />
                        <br />
                        <div className="w-full flex justify-center">
                            <IoMdAddCircleOutline
                                className='dark:text-white text-black text-[25px] cursor-pointer'
                                onClick={newCategoriesHandler}
                            />
                        </div>
                        <div className={`${styles.button} !w-[100px] !min-h-10 !h-10 dark:text-white text-black bg-[#cccccc34] ${areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoriesTitleEmpty(categories) ? "!cursor-not-allowed" : "!cursor-pointer !bg-[#42d383]"
                            } !rounded absolute bottom-12 right-12`}
                            onClick={areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoriesTitleEmpty(categories) ? () => null : handleCategoriesEdit}
                        >Save</div>
                    </div>
                )
            }
        </>
    )
}

export default EditCategories