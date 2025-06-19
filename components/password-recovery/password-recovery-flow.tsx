"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MethodSelection from "./step1-method-selection"
import VerificationCode from "./step2-verification-code"
import NewPassword from "./step3-new-password"
import Success from "./step4-success"

export default function PasswordRecoveryFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<"email" | "sms">("email")
  const [idAcesso, setIdAcesso] = useState("")

  const handleMethodSelected = (selectedMethod: "email" | "sms", selectedIdAcesso: string) => {
    setMethod(selectedMethod)
    setIdAcesso(selectedIdAcesso)
    setStep(2)
  }

  const handleCodeVerified = () => {
    setStep(3)
  }

  const handlePasswordReset = () => {
    setStep(4)
  }

  const handleFinish = () => {
    router.push("/access")
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/access")
    }
  }

  return (
    <>
      {step === 1 && <MethodSelection onMethodSelected={handleMethodSelected} onBack={handleBack} />}

      {step === 2 && (
        <VerificationCode method={method} idAcesso={idAcesso} onCodeVerified={handleCodeVerified} onBack={handleBack} />
      )}

      {step === 3 && <NewPassword idAcesso={idAcesso} onPasswordReset={handlePasswordReset} onBack={handleBack} />}

      {step === 4 && <Success onFinish={handleFinish} />}
    </>
  )
}
