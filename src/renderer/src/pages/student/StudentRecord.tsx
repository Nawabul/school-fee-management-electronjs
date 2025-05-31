import { studentColumns } from '@renderer/components/student/columns'
import { TableComponent } from '@renderer/components/table/TableComponent'
import { Button } from 'flowbite-react'
import { JSX } from 'react'

const StudentRecord = (): JSX.Element => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Record</h1>
        <Button className="primary">Add Student</Button>
      </div>
      <TableComponent columns={studentColumns} data={datalist} />
    </div>
  )
}

export default StudentRecord

const datalist = [
  {
    id: 1,
    class: 1,
    reg_number: 'REG1001',
    student_name: 'John Doe',
    father_name: 'Michael Doe',
    mobile: '9876543210',
    admission_date: '2023-06-01',
    termission_date: null,
    initial_amount: 5000,
    current_amount: 1500,
    last_fee_date: '2025-05-01'
  },
  {
    id: 2,
    class: 2,
    reg_number: 'REG1002',
    student_name: 'Emily Smith',
    father_name: 'David Smith',
    mobile: '9123456780',
    admission_date: '2022-09-15',
    termission_date: null,
    initial_amount: 6000,
    current_amount: 3000,
    last_fee_date: '2025-04-28'
  },
  {
    id: 3,
    class: 1,
    reg_number: 'REG1003',
    student_name: 'Arjun Patel',
    father_name: 'Ramesh Patel',
    mobile: '9988776655',
    admission_date: '2023-01-10',
    termission_date: null,
    initial_amount: 5500,
    current_amount: 2000,
    last_fee_date: '2025-05-05'
  },
  {
    id: 4,
    class: 3,
    reg_number: 'REG1004',
    student_name: 'Sara Khan',
    father_name: 'Imran Khan',
    mobile: '9001122334',
    admission_date: '2023-07-20',
    termission_date: null,
    initial_amount: 4800,
    current_amount: 1000,
    last_fee_date: '2025-05-10'
  },
  {
    id: 5,
    class: 2,
    reg_number: 'REG1005',
    student_name: 'David Lee',
    father_name: 'Peter Lee',
    mobile: '9998887776',
    admission_date: '2022-11-05',
    termission_date: null,
    initial_amount: 6200,
    current_amount: 2500,
    last_fee_date: '2025-04-20'
  },
  {
    id: 6,
    class: 3,
    reg_number: 'REG1006',
    student_name: 'Priya Sharma',
    father_name: 'Anil Sharma',
    mobile: '9334455667',
    admission_date: '2023-02-15',
    termission_date: null,
    initial_amount: 4700,
    current_amount: 1200,
    last_fee_date: '2025-05-12'
  },
  {
    id: 7,
    class: 1,
    reg_number: 'REG1007',
    student_name: 'Mohammed Ali',
    father_name: 'Sami Ali',
    mobile: '9112233445',
    admission_date: '2022-08-25',
    termission_date: null,
    initial_amount: 5100,
    current_amount: 800,
    last_fee_date: '2025-05-02'
  },
  {
    id: 8,
    class: 2,
    reg_number: 'REG1008',
    student_name: 'Aisha Bano',
    father_name: 'Nasir Bano',
    mobile: '9445566778',
    admission_date: '2023-03-10',
    termission_date: null,
    initial_amount: 5300,
    current_amount: 1700,
    last_fee_date: '2025-05-08'
  },
  {
    id: 9,
    class: 1,
    reg_number: 'REG1009',
    student_name: 'Rahul Verma',
    father_name: 'Manoj Verma',
    mobile: '9667788990',
    admission_date: '2023-05-05',
    termission_date: null,
    initial_amount: 4900,
    current_amount: 1100,
    last_fee_date: '2025-04-30'
  },
  {
    id: 10,
    class: 3,
    reg_number: 'REG1010',
    student_name: 'Jennifer Brown',
    father_name: 'Robert Brown',
    mobile: '9554433221',
    admission_date: '2022-12-10',
    termission_date: null,
    initial_amount: 6000,
    current_amount: 2500,
    last_fee_date: '2025-05-03'
  },
  {
    id: 11,
    class: 1,
    reg_number: 'REG1011',
    student_name: 'Ananya Roy',
    father_name: 'Sourav Roy',
    mobile: '9080706050',
    admission_date: '2023-04-01',
    termission_date: null,
    initial_amount: 4800,
    current_amount: 1500,
    last_fee_date: '2025-05-11'
  },
  {
    id: 12,
    class: 2,
    reg_number: 'REG1012',
    student_name: 'Lucas Martin',
    father_name: 'Henry Martin',
    mobile: '9192939495',
    admission_date: '2022-10-20',
    termission_date: null,
    initial_amount: 5700,
    current_amount: 1900,
    last_fee_date: '2025-05-06'
  },
  {
    id: 13,
    class: 3,
    reg_number: 'REG1013',
    student_name: 'Tanya Desai',
    father_name: 'Nitin Desai',
    mobile: '9879879870',
    admission_date: '2023-06-01',
    termission_date: null,
    initial_amount: 5200,
    current_amount: 1000,
    last_fee_date: '2025-05-07'
  },
  {
    id: 14,
    class: 1,
    reg_number: 'REG1014',
    student_name: 'Sameer Kulkarni',
    father_name: 'Rajesh Kulkarni',
    mobile: '9765432109',
    admission_date: '2023-02-12',
    termission_date: null,
    initial_amount: 5400,
    current_amount: 1300,
    last_fee_date: '2025-05-01'
  },
  {
    id: 15,
    class: 2,
    reg_number: 'REG1015',
    student_name: 'Angela White',
    father_name: 'Bruce White',
    mobile: '9871234567',
    admission_date: '2023-01-30',
    termission_date: null,
    initial_amount: 6100,
    current_amount: 2100,
    last_fee_date: '2025-05-10'
  },
  {
    id: 16,
    class: 3,
    reg_number: 'REG1016',
    student_name: 'Vikram Singh',
    father_name: 'Suraj Singh',
    mobile: '9110099008',
    admission_date: '2023-03-22',
    termission_date: null,
    initial_amount: 5800,
    current_amount: 1700,
    last_fee_date: '2025-05-04'
  },
  {
    id: 17,
    class: 1,
    reg_number: 'REG1017',
    student_name: 'Neha Gupta',
    father_name: 'Vivek Gupta',
    mobile: '9898989898',
    admission_date: '2022-09-14',
    termission_date: null,
    initial_amount: 4900,
    current_amount: 1400,
    last_fee_date: '2025-05-09'
  },
  {
    id: 18,
    class: 2,
    reg_number: 'REG1018',
    student_name: 'Zainab Ahmed',
    father_name: 'Tariq Ahmed',
    mobile: '9202020202',
    admission_date: '2023-05-17',
    termission_date: null,
    initial_amount: 5300,
    current_amount: 1600,
    last_fee_date: '2025-05-08'
  },
  {
    id: 19,
    class: 3,
    reg_number: 'REG1019',
    student_name: 'Chris Paul',
    father_name: 'James Paul',
    mobile: '9333322221',
    admission_date: '2023-04-07',
    termission_date: null,
    initial_amount: 6000,
    current_amount: 2400,
    last_fee_date: '2025-05-06'
  },
  {
    id: 20,
    class: 1,
    reg_number: 'REG1020',
    student_name: 'Meena Reddy',
    father_name: 'Shankar Reddy',
    mobile: '9111999911',
    admission_date: '2023-01-18',
    termission_date: null,
    initial_amount: 5100,
    current_amount: 1200,
    last_fee_date: '2025-05-03'
  }
]
