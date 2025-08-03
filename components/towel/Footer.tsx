'use server'
import React from 'react'
import ToutiaoHot from './ToutiaoHot'
import SearchInput from './SearchInput'
import Ablout from './Ablout'

export default async function Footer() {
    return (
        <div className='space-y-2'>
            <SearchInput></SearchInput>
            <ToutiaoHot></ToutiaoHot>
            <Ablout></Ablout>
        </div>
    )
}