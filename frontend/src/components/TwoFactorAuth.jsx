import React, { useState } from 'react'
import OtpInput from 'react-otp-input';

const TwoFactorAuth = () => {
  const [otp, setOtp] = useState('');

  return (
    <div className='flex flex-col mt-10 items-center justify-center h-full'>
      <div className='text-center space-y-[60px]'>
        <div>
          <svg className='justify-self-centerc mx-auto' width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 78C60.5391 78 78 60.5391 78 39C78 17.4609 60.5391 0 39 0C17.4609 0 0 17.4609 0 39C0 60.5391 17.4609 78 39 78Z" fill="url(#paint0_linear_134_31)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M45.0801 48.7197C44.4307 49.132 43.6179 49.1914 42.9156 48.8777C41.5233 48.1055 38.9844 46.2627 35.4627 42.741C31.941 39.2193 29.9344 36.5107 29.1564 35.136C28.8427 34.4337 28.902 33.6208 29.3143 32.9715L31.3384 29.4264C32.0638 28.1687 32.2276 27.3731 31.4379 26.1504L26.2372 18.1885C24.7572 15.8485 24.0025 15.9539 22.7272 16.5389C16.0933 19.5575 13.5018 23.8279 22.9144 38.6928C25.4533 42.7 33.2104 51.1826 39.8268 55.4765C53.9955 64.6785 58.6579 61.9115 61.425 55.4765C62.01 54.1778 62.2674 53.4231 60.0385 51.9665L51.9889 46.8477C50.7663 46.0638 50.1696 45.8591 48.906 46.5903L45.0801 48.7197Z" fill="white" />
            <defs>
              <linearGradient id="paint0_linear_134_31" x1="78" y1="85.5" x2="78" y2="5.81728e-07" gradientUnits="userSpaceOnUse">
                <stop stopColor="#337DF2" />
                <stop offset="1" stopColor="#9ABCF4" />
              </linearGradient>
            </defs>
          </svg>

        </div>
        <div>

          <p className='font-poppins font-normal text-[20px] '>Please check your phone</p>
          <p className='font-poppins font-normal text-[14px] '>You have received a code via SMS, Entre the code to secure your account</p>
        </div>

        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          placeholder='______'
          inputType='tel'
          isInputNum="true"
          shouldAutoFocus="true"
          renderInput={(props) => <input {...props} />}
          inputStyle="otp-input placeholder:text-transparent laceholder:text-5xl focus:placeholder:text-[#418DFD] focus:border-[#418DFD] focus:ring-0 focus:outline-none focus:caret-transparent"
          containerStyle="flex justify-between space-x-[5px] sm:space-x-[10px] md:space-x-[20px] lg:space-x-[30px]"
        />
        {/* buttons */}
        <div className='flex flex-col items-center justify-center space-y-[10px]'>

          <button
            className="w-3/4 font-montserrat h-10 bg-[#418DFD] text-base hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
            type="button"
          >
            Verify
          </button>
          <button
            className="w-3/4  font-poppins h-10 bg-[#EDF0F3] font-normal text-sm hover:bg-[#EDF0F3]/[.5] text-black/[.5] hover:text-black/[.7] py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
            type="button"
          >
            Back
          </button>
          <p className='font-poppins text-xs'>Didn’t get a code? <span className='underline'>Click to resend</span></p>
        </div>
        <div className='w-full text-center text-4xl font-normal font-goretzk'>
          <strong><span>Jo</span><span className='text-[#6610F2]'>B</span><span>old</span><span className='text-[#6610F2]'>.</span></strong>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorAuth