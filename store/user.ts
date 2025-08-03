import { create } from 'zustand'

type Store = {
    email: string;
    id: string;
    avatar: string;
    name:string;
}

export const userStore = create<Store>()((set) => ({
    email: '',
    id: '',
    avatar: '',
    name:'',
}))

