import useModel from '@renderer/hooks/useModel'
import { CircleAlert, X } from 'lucide-react'
import React from 'react'

function Model(): React.ReactNode {
  const { content, closeModel } = useModel()
  const {
    title,
    closeFun,
    closeTitle,
    closeable,
    component,
    componentOnly,
    show,
    submitFun,
    submitTitle,
    description,
    showSubmitBtn
  } = content

  const closeModelHandler = (): void => {
    closeFun()
    closeModel()
  }
  const susscesHander = (): void => {
    submitFun()
    closeModel()
  }
  return (
    <>
      {show && (
        <div className="h-[100vh] w-[100vw] absolute bg-gray-600/50 flex justify-center items-center z-50">
          <div className="absolute inset-0 pb-22 bg-black/60 backdrop-blur-xs"></div>
          <div
            id="popup-modal"
            className="overflow-y-auto  overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center "
          >
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              {closeable && (
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                  onClick={closeModelHandler}
                >
                  <X />
                  <span className="sr-only">Close modal</span>
                </button>
              )}

              {componentOnly && component}

              {!componentOnly && (
                <div className="p-4 md:p-5 text-center">
                  <CircleAlert className="mx-auto mb-4 text-yellow-400 w-12 h-12" />

                  <div className="flex flex-col gap-2">
                    <h3 className="mb-2 text-2xl font-bold dark:text-white">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {description}
                    </p>
                    {component && <div>{component}</div>}
                  </div>
                  <div className="flex mt-5 justify-center items-center gap-4 w-full">
                    {closeable && (
                      <button
                        type="button"
                        onClick={closeModelHandler}
                        className="w-full py-2.5 px-5 text-sm font-medium text-slate-300 focus:outline-none bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-slate-500 transition-colors"
                      >
                        {closeTitle}
                      </button>
                    )}
                    {showSubmitBtn && (
                      <button
                        type="button"
                        onClick={susscesHander}
                        className="w-full py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed flex justify-center items-center"
                      >
                        {submitTitle}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Model
