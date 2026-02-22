'use server'
import React from 'react'
import ToutiaoHot from './ToutiaoHot'
import SearchInput from './SearchInput'
import Ablout from './Ablout'
import FollowCard from './FollowCard'
import GkxAiSidebar from './GkxAiSidebar'
import GkxAiSidebarServer from './GkxAiSidebarServer'

export default async function Footer() {
    return (
        <div className='space-y-2'>
            <GkxAiSidebarServer></GkxAiSidebarServer>
            <SearchInput></SearchInput>
            <FollowCard></FollowCard>
            <ToutiaoHot></ToutiaoHot>
            <Ablout></Ablout>
        </div>
    )
}