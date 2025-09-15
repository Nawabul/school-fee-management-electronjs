import { studentColumns } from '@renderer/components/student/columns'
import { TableComponent } from '@renderer/components/table/TableComponent'
import { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useQuery } from '@tanstack/react-query'
import StudentController from '@renderer/controller/StudentController'
import { Student_Record } from '@renderer/types/ts/student'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
import useModel from '@renderer/hooks/useModel'
import Header from '@renderer/components/Header'
import useMutationHandler from '@renderer/hooks/useMutationHandler'

const StudentRecord = (): JSX.Element => {
  const { data = [], refetch } = useQuery({
    queryKey: queryKey.student,
    queryFn: StudentController.list,
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()
  const { setStudentDetails } = useStudentDetails()
  const studentDelete = useMutationHandler({
    mutationFn: StudentController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })
  const studyContinue = useMutationHandler({
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
      openModel({
        title: 'Confirm Transfer',
        description:
          'This student will be marked as transferred and will no longer be enrolled in this school. Do you want to continue?',

        submitTitle: 'Transfer',
        closeTitle: 'Cancel',
        submitFun: () => {
          setStudentDetails(data)
          navigate(`/student/transfer/${id}`)
        }
      })
    },

    continue: (id: number) => {
      openModel({
        title: 'Confirm Reactivation',
        description:
          'The student will be marked as active again, but their fees will not be synced. Proceed?',

        submitTitle: 'Continue',
        closeTitle: 'Cancel',
        submitFun: () => handleContinue(id)
      })
    },
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
