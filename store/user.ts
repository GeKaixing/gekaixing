import { create } from 'zustand'

type Store = {
    email: string;
    id: string;
    name:string;
    user_background_image:string
    user_avatar:string
}

export const userStore = create<Store>()((set) => ({
    email: '',
    id: '',
    name:'',
    user_background_image:'',
    user_avatar:''
}))

