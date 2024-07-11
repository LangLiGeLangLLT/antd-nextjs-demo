'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const { Item: FormItem } = Form
const { Password: InputPassword } = Input

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean(),
})

export default function Home() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: true,
    },
    mode: 'all',
  })
  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values)
  }
  const onReset = () => {
    reset({
      username: 'admin',
      password: 'xxx',
      rememberMe: false,
    })
  }

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch])

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-1/2">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onSubmitCapture={handleSubmit(onSubmit)}
        >
          <FormItem
            label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormItem>

          <FormItem
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => <InputPassword {...field} />}
            />
          </FormItem>

          <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={field.onChange}>
                  Remember me
                </Checkbox>
              )}
            />
          </FormItem>

          <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <div className="space-x-2">
              <Button onClick={onReset}>Reset</Button>

              <Button type="primary" htmlType="submit" disabled={!isValid}>
                Submit
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}
