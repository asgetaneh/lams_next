// app/offices/page.tsx
import OfficeForm from '@/app/office/OfficeForm'
import OfficeList from '@/app/office/OfficeList'

export default function OfficesPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* <OfficeForm /> */}
      <OfficeList />
    </div>
  )
}
