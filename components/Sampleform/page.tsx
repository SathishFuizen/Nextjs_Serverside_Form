import React from 'react'
import { redirect } from 'next/navigation'
import * as Yup from 'yup'


const formShema=Yup.object({
  name:Yup.string().min(3,"Name must be at least 3 characters").required("name must required"),
  email:Yup.string().email("Invalid email").required("email is required"),
  message:Yup.string().min(10,"message must be at least 10 charatcerstics").required("message is required")
})
function page({searchParams}:{searchParams:any}) {
  const errors = JSON.parse(searchParams?.errors || '{}') //Retrieve errors from URL params

  async function handleSubmit(formData:FormData){
    'use server'; // Mark as a server-side action
    const name=formData.get('name')?.toString() || '';
    const email=formData.get('email') ?.toString() || '';
    const message=formData.get('message')?.toString() || '';

        // Validate the form data using Yup schema
        try{
          await formShema.validate({name,email,message},{abortEarly:false})

          const response=await fetch('/api/contact',{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({name,email,message})
          })
          if (response.ok){
            redirect('/Thank You....')
          }

        }catch(validationErrors:any){
          const formErrors=validationErrors.inner.reduce((acc:any,error:any)=>{
            acc[error.path] = error.message

          },{})
            // Redirect back to the form with validation errors
            const errorParams=new URLSearchParams({errors:JSON.stringify(formErrors)})
            redirect(`/form?${errorParams.toString()}`);
        }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <form
      action={handleSubmit}
      method="POST"
      className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Contact Us</h2>

      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors?.name ? 'border-red-500' : 'focus:ring-blue-500'
          }`}
          required
        />
        {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors?.email ? 'border-red-500' : 'focus:ring-blue-500'
          }`}
          required
        />
        {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Message Field */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors?.message ? 'border-red-500' : 'focus:ring-blue-500'
          }`}
          required
        />
        {errors?.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  </div>
  )
}

export default page