'use client'

import React from 'react'
import AuthForm from '../../components/AuthForm'

export default function Page() {
  return (
    <div className="p-6">
      <AuthForm mode="signin" />
    </div>
  )
}
