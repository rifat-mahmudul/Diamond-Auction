import ContactUsFrom from "@/components/ContactUsFrom"
import PathTracker from "@/Shared/PathTracker"

const page = () => {
  return (
    <div className="mt-28 container ">
      <PathTracker />
      <div className="flex justify-center mt-10">
        <h2 className="text-[40px] text-[#000000] font-semibold">Contact Us</h2>
      </div>
      <ContactUsFrom/>
    </div>
  )
}

export default page