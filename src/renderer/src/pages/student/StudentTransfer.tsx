import { useMutation } from '@tanstack/react-query'
import { Button, ToggleSwitch } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import StudentController from '@renderer/controller/StudentController'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import FormInput from '@renderer/components/form/FormInput'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { todayISODate } from '@renderer/types/constant/date'
import { useMemo } from 'react'

const Schema = z.object({
  date: z.string({
    required_error: 'Date is required'
  }),
  month_charge: z.boolean().default(false)
})

const StudentTransfer = (): React.JSX.Element => {
  const navigate = useNavigate()
  const studentId = useParams().id
  const { control, handleSubmit, setValue, watch } = useForm<z.infer<typeof Schema>>({
    //@ts-ignore ites working well
    resolver: zodResolver(Schema),
    defaultValues: {
      date: todayISODate
    }
  })

  const studentMutation = useMutation({
    mutationKey: ['student', 'transfer'],
    mutationFn: (data) => StudentController.transfer(Number(studentId), data),
    onSuccess: () => {
      navigate('/student')
      // Optionally reset form or show success message
    },
    onError: () => {
      // Optionally show error message
    }
  })

  const dateRange = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const maxDate = new Date(year, month, 0)
    const smonth = String(month).padStart(2, 0)

    const min = `${year}-${smonth}-01`
    const max = `${year}-${smonth}-${maxDate.getDate()}`
    return {
      min,
      max
    }
  }, [])

  const onSubmit = (data): void => {
    studentMutation.mutate(data)
  }

  return (
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Leave Student</h1>
        </div>
        <div>
          <Link to={'/student'}>
            <Button>View All Student</Button>
          </Link>
        </div>
      </div>
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader />
      {/* END HEADER CARD */}
      <div className="md:p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
        >
          {/* Registration Number */}
          <FormInput
            min={`${dateRange.min}`}
            max={dateRange.max}
            name="date"
            label="Date"
            placeholder="Transfer Date"
            type="date"
            control={control}
          />
          <ToggleSwitch
            name="month_charge"
            label="Include Current Month Fee"
            className="mt-8 pl-5"
            checked={watch('month_charge')}
            onChange={(checked) => setValue('month_charge', checked)}
            color="green"
            sizing="md"
          />

          {/* Submit */}
          <div className="md:col-span-2 mt-auto ml-auto">
            {studentMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Button type="submit" size="md" className="w-60">
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentTransfer
