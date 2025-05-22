import React, { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner';
import { Loader, Loader2 } from 'lucide-react';

function BuyCourseButton({ courseId }) {
  const [isLoading,setIsLoading]=useState(false);
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/purchase/checkout/create-checkout-session`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          courseId
        })
      });

      const data = await res.json();
      // console.log(data);
      handlePaymentVerify(data.order)
      setIsLoading(false);
    } catch (error) {
      console.error(error)
    }
  }
  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Aniruddha",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        console.log("response", response)
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/purchase/webhook`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          })

          const verifyData = await res.json();

          if (verifyData.message) {
            window.location.href = "http://localhost:5173/course-progress/680b477ac4e367c5a228609a";
            toast.success(verifyData.message)
          }
        } catch (error) {
          console.log(error);
        }
      },
      "method": {
        "netbanking": true,
        "card": true,
        "upi": true,
        "wallet": false,
        "emi": false,
        "paylater": false
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }
  return (
    <Button onClick={handlePayment} disabled={isLoading} className="w-full">
      {
        isLoading?<>
          <Loader2 className='mr-3 animate-spin h-2 w-2'/> please wait
        </>:<p>Purchase Course</p>
      }
    </Button>
  )
}

export default BuyCourseButton