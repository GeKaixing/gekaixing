import { create } from 'zustand'

type Store = {
    email: string;
    id: string;
    name:string;
    user_background_image:string
    user_avatar:string
    brief_introduction:string
}

export const userStore = create<Store>()((set) => ({
    email: '',
    id: '',
    brief_introduction:"",
    name:'',
    user_background_image:'',
    user_avatar:''
}))

