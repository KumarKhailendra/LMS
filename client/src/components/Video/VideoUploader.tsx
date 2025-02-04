import { styles } from '@/styles/style';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    courseContentData?: any;
    courseInfo?: any;
    index?: number;
    setCourseContentData?: (courseContentData: any) => void;
    setCourseInfo?: (courseInfo: any) => void;
}
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI ?? "localhost:8000/api/v1/"


const VideoUploader:React.FC<Props> = ({courseContentData, courseInfo, index, setCourseContentData, setCourseInfo}) => {

    const [dragging, setDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
    }

    const handleVideoFileChange = async (e: any) => {
        try {
            const file = e.target.files?.[0];
            const formData = new FormData();
            formData.append('video', file);
            setIsUploading(true);
            setIsLoading(true);

            const response = await axios.post(`${baseUrl}videos/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    } else {
                        console.warn("Total upload size is unknown.");
                    }
                },
            });

            setIsLoading(false);

            if (typeof index !== 'undefined' && courseContentData) {
                const updateData = [...courseContentData];
                updateData[index].videoUrl = response?.data?.id;
                updateData[index].videoLength = response?.data?.duration;
                setCourseContentData?.(updateData);
            } else if (courseInfo) {
                setCourseInfo?.({ ...courseInfo, demoUrl: response?.data?.id });
            }

        } catch (error:any) {
            toast.error(`Video upload error: ${error.response.data.message}`);
            console.error('Video upload error:', error);
            setIsUploading(false);
        }
    };

    const handleVideoDelete = async () => {
        try {
            if (typeof index !== 'undefined' && courseContentData) {
                const response = await axios.delete(`${baseUrl}videos/delete/${courseContentData[index].videoUrl}`);
                toast.success(response.data.message);
                const updateData = [...courseContentData];
                updateData[index].videoUrl = '';
                updateData[index].videoLength = 0;
                setCourseContentData?.(updateData);
                console.log(">>>>>>>>>>>>>>courseInfo",courseInfo);
            } else if (courseInfo) {
                
                const response = await axios.delete(`${baseUrl}videos/delete/${courseInfo.demoUrl}`);
                toast.success(response.data.message);
                setCourseInfo?.({ ...courseInfo, demoUrl: '' });
            }
            setIsUploading(false);
        } catch (error) {
            toast.error(`Video delete error: ${error}`);
            console.error('Video delete error:', error);
        }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        const urlId = typeof index !== 'undefined' ? courseContentData?.[index]?.videoUrl : courseInfo?.demoUrl;
        if (urlId) {
            setIsUploading(true);
            setUploadProgress(100);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <label htmlFor="videoURL" className={styles.label}>Video</label>
            {
                !isUploading ? (
                    <>
                        <input
                            type="file"
                            accept='video/*'
                            id='videoURL'
                            className='hidden'
                            onChange={(e: any) => handleVideoFileChange(e)}
                        />
                        <label htmlFor="videoURL" className={`w-full min-h-[10vh] dark:border-white border-[#00000026] mt-2 p-3 border border-dashed flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"
                            }`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                            <span className='text-black dark:text-white'>
                                Drag and drop your Video file here or click to browse
                            </span>
                        </label>
                    </>
                ) : (
                    <>
                        <div className='w-full min-h-[10vh] flex items-center gap-4 dark:text-white text-black bg-transparent border mt-2 border-[#00000026] rounded dark:border-white p-2'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                fill="#3b82f6"
                                height="35px"
                                width="35px"
                                version="1.1"
                                id="Layer_1"
                                viewBox="0 0 512 512"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <g>
                                        <g>
                                            <path d="M447.147,134.613c-0.533-1.28-1.28-2.453-2.347-3.413l-128-128c-1.92-2.027-4.693-3.2-7.467-3.2H74.667 C68.8,0,64,4.8,64,10.667v490.667C64,507.2,68.8,512,74.667,512h362.667C443.2,512,448,507.2,448,501.333V138.667 C448,137.28,447.68,135.893,447.147,134.613z M320,36.373L411.627,128H320V36.373z M426.667,490.667H85.333V21.333h213.333 v117.333c0,5.867,4.8,10.667,10.667,10.667h117.333V490.667z" />
                                            <path d="M175.467,172.587c-3.093,2.027-4.8,5.44-4.8,8.96V394.24c0,3.947,2.027,7.68,5.44,9.6c3.52,1.92,7.68,1.707,10.773-0.32 l170.453-106.453c5.013-3.093,6.507-9.707,3.413-14.613c-0.853-1.493-2.027-2.667-3.413-3.52L187.2,172.587 C183.573,170.347,178.987,170.24,175.467,172.587z M192,200.533L331.84,288L192,375.467V200.533z" />
                                        </g>
                                    </g>
                                </g>
                            </svg>

                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex-1">
                                    <h6 className="text-sm font-normal">kkk</h6>
                                    <div className="w-full h-[5px] bg-[rgba(0,0,0,0.076)] rounded-full mt-2">
                                        <div
                                            className="h-[5px] bg-[#3b82f6] rounded-full transition-width duration-500 ease-in-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-[36px] h-[36px] flex items-center justify-center text-sm text-[#463a99] bg-[#f1efff] rounded-full cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    {
                                        isHovered ? (
                                            <svg viewBox="0 0 500 670" xmlns="http://www.w3.org/2000/svg" onClick={handleVideoDelete}>
                                                <g transform="matrix(1.1782970428466795, 0, 0, 1.1676529645919798, 22.785415988943214, 114.81890277294667)">
                                                    <g id="Cancel">
                                                        <path d="M192.485,0C86.173,0,0,86.173,0,192.485c0,106.3,86.173,192.485,192.485,192.485c106.3,0,192.485-86.173,192.485-192.485&#10;&#9;&#9;&#9;S298.785,0,192.485,0z M192.485,360.909c-93.018,0-168.424-75.406-168.424-168.424S99.467,24.061,192.485,24.061&#10;&#9;&#9;&#9;s168.424,75.406,168.424,168.424S285.503,360.909,192.485,360.909z" fill="#1C274C" />
                                                        <path d="M273.437,255.897l-63.376-63.388l63.015-62.497c4.752-4.704,4.752-12.319,0-17.011c-4.74-4.692-12.439-4.692-17.179,0&#10;&#9;&#9;&#9;l-62.931,62.413l-63.869-63.881c-4.74-4.764-12.439-4.764-17.179,0c-4.74,4.752-4.74,12.475,0,17.227l63.773,63.785&#10;&#9;&#9;&#9;l-64.134,63.604c-4.74,4.704-4.74,12.319,0,17.011c4.74,4.704,12.439,4.704,17.191,0l64.049-63.52l63.472,63.472&#10;&#9;&#9;&#9;c4.74,4.764,12.439,4.764,17.179,0C278.177,268.372,278.177,260.661,273.437,255.897z" fill="#1C274C" />
                                                    </g>
                                                </g>
                                            </svg>
                                        ) : (
                                            <>
                                                {

                                                    (isLoading) ? (
                                                        <div className="absolute text-center text-xs font-bold text-[#463a99]">
                                                            {uploadProgress}%
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                                            <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="#1C274C" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#1C274C" />
                                                        </svg>
                                                    )

                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default VideoUploader