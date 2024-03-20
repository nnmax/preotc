import ConnectWalletToolbar from '@/components/ConnectWalletToolbar'
import LinkTab from '@/components/LinkTab'
import NavTabs from '@/components/NavTabs'

export default function AppBar() {
  return (
    <header
      className={'flex h-16 flex-row items-center bg-[#030303] px-[60px] py-4'}
    >
      <h1 className={'mr-20 text-[28px] leading-8 text-[#FFC300]'}>
        {'PREOTC'}
      </h1>

      <NavTabs>
        <LinkTab href={'/market'}>{'Market'}</LinkTab>
        <LinkTab href={'/dashboard'}>{'Dashboard'}</LinkTab>
      </NavTabs>

      <div className={'ml-auto'}>
        <ConnectWalletToolbar />
      </div>
    </header>
  )
}
