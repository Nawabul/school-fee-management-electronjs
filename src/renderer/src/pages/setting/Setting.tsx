import SessionEndSet from '@renderer/components/session/SessionEndSet'

function Setting() {
  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">Setting</h1>
        </div>
      </div>


      <div className="flex flex-col">
        <div className='flex'>
        <span>Session End Month</span>

        </div>
      </div>
    </>
  )
}

export default Setting
