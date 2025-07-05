import useModel from '@renderer/hooks/useModel'
import { CircleAlert, X } from 'lucide-react'
import React from 'react'

function Model(): React.ReactNode {
  const { alert, closeModel } = useModel()

  const closeModelHandler = (): void => {
    closeModel()
  }
  const susscesHander = (): void => {
    alert?.fun()
    closeModel()
  }
  return (
    <>
      {alert != null && (
        <div className="h-[100vh] w-[100vw] absolute opacity-40  bg-gray-600 flex justify-center items-center z-50">
          <div
            id="popup-modal"
            className="overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center  "
          >
            <div className="relative p-4 w-full max-w-md max-h-full opacity-100 bg-gray-600">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                  onClick={closeModelHandler}
                >
                  <X />
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <CircleAlert className="mx-auto mb-4 text-red-900 w-12 h-12 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this?
                  </h3>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    onClick={susscesHander}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    Yes, I&apos;m sure
                  </button>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={closeModelHandler}
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Model
