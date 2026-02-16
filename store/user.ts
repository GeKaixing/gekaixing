import { create } from 'zustand'

type Store = {
    email: string;
    id: string;
    userid: string;
    name:string;
    user_background_image:string
    user_avatar:string
    brief_introduction:string
}

export const userStore = create<Store>()((set) => ({
    email: '',
    id: '',
    userid: '',
    brief_introduction:"",
    name:'',
    user_background_image:'',
    user_avatar:''
}))

