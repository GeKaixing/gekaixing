import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import ExploreTabs from '@/components/gekaixing/ExploreTabs'
import SearchInput from '@/components/gekaixing/SearchInput'
import { getTranslations } from 'next-intl/server'

export default async function Page() {
    const t = await getTranslations("ImitationX.Explore")
    return (
        <div >
            <ArrowLeftBack name={t("title")}></ArrowLeftBack>
            <div className='px-4'>
                <SearchInput></SearchInput>
                <ExploreTabs></ExploreTabs>
            </div>
        </div>
    )
}
