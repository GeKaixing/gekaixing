import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import ExploreTabs from '@/components/gekaixing/ExploreTabs'
import SearchInput from '@/components/gekaixing/SearchInput'

export default function page() {
    return (
        <div >
            <ArrowLeftBack name='探索'></ArrowLeftBack>
            <div className='px-4'>
                <SearchInput></SearchInput>
                <ExploreTabs></ExploreTabs>
            </div>
        </div>
    )
}