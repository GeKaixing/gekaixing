import { create } from 'zustand'

type Store = {
    poset_images: string[];

}

export const post_imagesStore = create<Store>()((set) => ({
    poset_images: [],
}))

