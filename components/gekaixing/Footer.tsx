'use server'
import React from 'react'
import ToutiaoHot from './ToutiaoHot'
import SearchInput from './SearchInput'
import Ablout from './Ablout'
import FollowCard from './FollowCard'
import GkxAiSidebarServer from './GkxAiSidebarServer'
import ShowOnGkx from './ShowOnGkx'

export default async function Footer() {
    return (
        <div className='space-y-2'>
            <ShowOnGkx>
                <GkxAiSidebarServer></GkxAiSidebarServer>
            </ShowOnGkx>
            <SearchInput></SearchInput>
            <FollowCard></FollowCard>
            <ToutiaoHot></ToutiaoHot>
            <Ablout></Ablout>
        </div>
    )
}
