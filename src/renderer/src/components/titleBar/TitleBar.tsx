import { useEffect, useState } from 'react'
import { Minus, School, Square, X } from 'lucide-react'

// import logo from '../../../public/site-logo2.png'
import './style.css'
import Restore from '@renderer/assets/Restore'

const minimize = (): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  window.setting.minimize()
}
const maximizeToggle = (): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  window.setting.toggle()
}
const close = (): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  window.setting.close()
}
const TitleBar = (): React.JSX.Element => {
  const [isRestore, setRestore] = useState<boolean>(true)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.setting?.eventTrigger('isMaximize', () => {
      setRestore(false)
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.setting?.eventTrigger('isRestore', () => {
      setRestore(true)
    })
  }, [])

  return (
    <div>
      <header className="flex fixed left-0 right-0 pb-1 items-center gap-4 bg-gray-800 text-white cus-head overflow-hidden">
        {/* top task bar */}
        <div className="w-full md:text-[15px] text-[10px] text-gray-400 flex gap-4 pl-40 items-center justify-center my-auto">
          {/* <img className="h-6" src={logo} alt="Doctor slip" /> */}
          <School className="h-4 md:h-6" />
          <p className="font-semibold">School Fee Management System</p>
        </div>
        {/* <ThemeSwitch className="title_theme" /> */}

        <div className="ml-6 text-center self-start flex title_button">
          <div className="hover:bg-slate-600 place-content-center w-9 h-9" onClick={minimize}>
            <Minus className="mx-auto" size={19} color={'white'} />
          </div>
          <div className="hover:bg-slate-600 place-content-center w-9 h-9" onClick={maximizeToggle}>
            {isRestore ? (
              <Square color={'white'} size={15} className="mx-auto" />
            ) : (
              <Restore color={'white'} size={15} className="mx-auto" />
            )}
          </div>
          <div className="hover:bg-red-600 place-content-center z-50 w-9 h-9" onClick={close}>
            <X className="mx-auto" size={19} color={'white'} />
          </div>
        </div>
      </header>
    </div>
  )
}

export default TitleBar
