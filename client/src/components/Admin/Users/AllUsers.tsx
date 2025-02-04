import React, { useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMail } from 'react-icons/ai'
import { useTheme } from 'next-themes';
import { format } from 'timeago.js';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import Link from 'next/link';

type Props = {
    isTeam?: Boolean;
}

const AllUsers: React.FC<Props> = ({ isTeam }) => {
    const { theme, setTheme } = useTheme();
    const [active, setActive] = useState<Boolean>(false)

    const { isLoading, data, error } = useGetAllUsersQuery({})

    const colums: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "name", headerName: "Name", flex: .4 },
        { field: "email", headerName: "Email", flex: 0.6 },
        { field: "role", headerName: "Role", flex: 0.2 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.3 },
        { field: "created_at", headerName: "Joined At", flex: 0.3 },
        {
            field: " ",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Button>
                            <AiOutlineDelete
                                className='dark:text-white text-black'
                                size={20}
                            />
                        </Button>
                    </>
                )
            }
        },
        {
            field: "  ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Link href={`mailto:${params.row?.email}`} className='flex justify-center align-middle items-center h-full'>
                            <AiOutlineMail
                                className='dark:text-white text-black'
                                size={20}
                            />
                        </Link>
                    </>
                )
            }
        },
    ];
    const rows: any = [];
    if (isTeam) {
        const newData = data?.users.filter((item: any) => item?.role === "admin")
        newData?.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            })
        })
    } else {
        data?.users.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            })
        })
    }
    return (
        <div className='mt-[120px]'>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Box m="20px">
                        {
                            isTeam && (
                                <div className="w-full flex justify-end">
                                    <div
                                        className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                                        onClick={() => setActive(!active)}
                                    >
                                        Add New Member
                                    </div>
                                </div>
                            )
                        }
                        <Box
                            m="40px 0 0 0"
                            height={"80vh"}
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    outline: "none",
                                },
                                "& .MuiDataGrid-sortIcon": {
                                    color: theme === 'dark' ? "#fff" : "#000",
                                },
                                "& .MuiDataGrid-row": {
                                    color: theme === 'dark' ? "#fff" : "#000",
                                    borderBottom: theme === 'dark' ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                                },
                                "& .MuiTablePagination-root": {
                                    color: theme === 'dark' ? "#fff" : "#000",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    color: theme === 'dark' ? "#fff" : "#000",
                                    backgroundColor: theme === 'dark' ? "#3e4396" : "#A4A9FC",
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: theme === 'dark' ? "#1F2A40" : "#F2F0F0",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    backgroundColor: theme === 'dark' ? "#3e4396" : "#A4A9FC",
                                    color: theme === 'dark' ? "#fff" : "#000",
                                    borderTop: "none",
                                },
                                "& .MuiCheckbox-root": {
                                    color: theme === 'dark' ? "#b7ebde !important" : "#000f60 !important",
                                },
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={colums}
                                // initialState={{
                                // pagination: {
                                //     paginationModel: {
                                //     pageSize: 5,
                                //     },
                                // },
                                // }}
                                // pageSizeOptions={[5]}
                                checkboxSelection
                            // disableRowSelectionOnClick
                            />
                        </Box>
                    </Box>
                )
            }
        </div>
    )
}

export default AllUsers