import { studentColumns } from '@renderer/components/student/columns'
import { TableComponent } from '@renderer/components/table/TableComponent'
import { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useMutation, useQuery } from '@tanstack/react-query'
import StudentController from '@renderer/controller/StudentController'
import { Student_Record } from '@renderer/types/ts/student'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
import useModel from '@renderer/hooks/useModel'
import Header from '@renderer/components/Header'

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
  const { openModel } = useModel()
  const handleDelete = (id: number): void => {
    studentDelete.mutate(id)
    setId(id)
  }
  const handleContinue = (id: number): void => {
    studyContinue.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number, data: Student_Record) => void> = {
    update: (id: number): void => {
      navigate(`/student/update/${id}`)
    },
    admission: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/admission/${id}`)
    },
    transfer: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/student/transfer/${id}`)
    },

    continue: handleContinue,
    delete: (id: number) => {
      openModel({
        submitFun: () => handleDelete(id)
      })
    },
    payment: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/finance/payment/${id}`)
    },
    mis_charge: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/mis_charge/${id}`)
    },
    monthly_fee: (id: number, data: Student_Record): void => {
      setStudentDetails(data)
      navigate(`/monthly_fee/${id}`)
    }
  }

  return (
    <div className="p-5">
      <Header
        title="Student Record"
        subtitle="Students / Student Record"
        buttonText="Add Student"
        buttonLink="/student/insert"
        icon={<CgUserList size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
      <TableComponent
        columns={studentColumns(item)}
        data={data}
        id={id}
        isLoading={studentDelete.isPending}
      />
    </div>
  )
}

export default StudentRecord
