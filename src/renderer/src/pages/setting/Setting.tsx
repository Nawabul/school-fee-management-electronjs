import SessionEndSet from '@renderer/components/session/SessionEndSet'
import { BuildingIcon, SettingsIcon } from 'lucide-react'
import { JSX, useRef, useState } from 'react'

interface Section {
  id: string
  name: string
  icon: JSX.Element
}

function Setting(): React.ReactElement {
  const [activeSection, setActiveSection] = useState('school_session')
  const mainContentRef = useRef(null)

  const sections: Section[] = [
    { id: 'school_session', name: 'School Session', icon: <BuildingIcon className="w-5 h-5" /> }
  ]

  const renderContent = (): React.ReactElement => {
    switch (activeSection) {
      case 'school_session':
        return (
          <SettingCard id="general" title="General School Information">
            <>
              <SettingRow
                label="School Session"
                description="Month will be considered as end month of the student who are stil studing"
              >
                <SessionEndSet sumbitFun={() => {}} btnStyle={{ width: 180, marginLeft: 'auto' }} />
              </SettingRow>
            </>
          </SettingCard>
        )
      default:
        return <></>
    }
  }

  return (
    <div className="flex min-h-screen overflow-y-hidden bg-slate-900 text-slate-300 font-sans">
      {/* Main Content */}
      <div ref={mainContentRef} className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <SettingsIcon className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">
              Apne school ki configuration aur pasand ko manage karein
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 h-[72vh]">
          <div className="lg:col-span-1 bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="space-y-2 sticky top-8">
              {sections.map((section) => (
                <a
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`${activeSection === section.id ? 'bg-slate-700/50 border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:border-slate-600'} w-full flex items-center gap-3 p-4 border-l-2 font-medium text-sm transition-all rounded-r-md`}
                >
                  {section.icon} <span>{section.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default Setting

const SettingCard = ({
  id,
  title,
  children
}: {
  id: string
  title: string
  children: React.ReactElement
}): React.ReactElement => (
  <div id={id} className="bg-slate-800 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-white p-6 border-b border-slate-700">{title}</h3>
    <div className="p-6 space-y-6">{children}</div>
  </div>
)

const SettingRow = ({
  label,
  description,
  children
}: {
  label: string
  description: string
  children: JSX.Element
}): React.ReactElement => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    <div className="md:col-span-1">
      <label className="font-medium text-white">{label}</label>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <div className="md:col-span-2">{children}</div>
  </div>
)
