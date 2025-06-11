import { studentColumns } from '@renderer/components/student/columns'
import { TableComponent } from '@renderer/components/table/TableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useMutation, useQuery } from '@tanstack/react-query'
import StudentController from '@renderer/controller/StudentController'
import { Student_Record } from '@renderer/types/ts/student'
import useStudentDetails from '@renderer/hooks/useStudentDetails'

const StudentRecord = (): JSX.Element => {
  const { data = [], refetch } = useQuery({
    queryKey: queryKey.student,
    queryFn: StudentController.list,
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()
  const { setStudentDetails } = useStudentDetails()
  const studentDelete = useMutation({
    mutationFn: StudentController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })
  const studyContinue = useMutation({
    mutationFn: StudentController.continue,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })

  const handleDelete = (id: number): void => {
    studentDelete.mutate(id)
    setId(id)
  }
  const handleContinue = (id: number): void => {
    console.log(id)
    studyContinue.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number, data: Student_Record) => void> = {
    update: (id: number): void => {
      navigate(`/student/update/${id}`)
    },
    transfer: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/student/transfer/${id}`)
    },

    continue: handleContinue,
    delete: handleDelete,
    payment: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/payment/${id}`)
    },
    mis_charge: (id: number, data: Student_Record): void => {
      console.log(data)
      setStudentDetails(data)
      navigate(`/mis_charge/${id}`)
    },
    monthly_fee: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/monthly_fee/${id}`)
    }
  }

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Student Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to="/student/insert"
          >
            Add Student
          </Link>
        </div>
      </div>
      <div className="md:p-5 min-h-full ">
        <TableComponent
          columns={studentColumns(item)}
          data={data}
          id={id}
          isLoading={studentDelete.isPending}
        />
      </div>
    </>
  )
}

export default StudentRecord
