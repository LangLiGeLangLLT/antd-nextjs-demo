'use client'

import { UploadOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Upload, UploadFile } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const { Item: FormItem } = Form

const schema = z.object({
  fileList: z
    .array(z.any())
    .min(1, { message: 'Please upload at least one file' }),
})

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fileList: [],
    },
    mode: 'all',
  })
  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values)
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-1/2">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onSubmitCapture={handleSubmit(onSubmit)}
        >
          <FormItem
            label="Upload"
            validateStatus={errors.fileList ? 'error' : ''}
            help={errors.fileList?.message}
          >
            <Controller
              name="fileList"
              control={control}
              render={({ field }) => (
                <Upload
                  fileList={field.value}
                  beforeUpload={(file) => {
                    const fileList = field.value as UploadFile[]
                    const newFileList = [...fileList, file]
                    field.onChange(newFileList)
                    return false
                  }}
                  onRemove={(file) => {
                    const fileList = field.value as UploadFile[]
                    const index = fileList.indexOf(file)
                    const newFileList = fileList.slice()
                    newFileList.splice(index, 1)
                    field.onChange(newFileList)
                  }}
                >
                  <Button danger={!!errors.fileList} icon={<UploadOutlined />}>
                    Select File
                  </Button>
                </Upload>
              )}
            />
          </FormItem>

          <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}
