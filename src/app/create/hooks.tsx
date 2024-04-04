'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Image from 'next/image'
import { listProject, listProjectUrl, type ListProjectResponse } from '@/api'
import type { SelectOption } from '@/components/Select'
import type { FormValues } from '@/app/create/types'

export function useSelectProps() {
  const { watch, setValue } = useFormContext<FormValues>()
  const [selectedProject, setSelectedProject] = useState<ListProjectResponse>()
  const { data: projects } = useSuspenseQuery({
    queryKey: [listProjectUrl],
    queryFn: listProject,
  })

  const selectOptions = projects.map<SelectOption<number>>((project) => ({
    name: (
      <>
        <Image
          src={project.avatarUrl}
          width={'20'}
          height={'20'}
          alt={project.name}
          className={'mr-2 rounded-full'}
        />
        <span>{project.name}</span>
      </>
    ),
    value: project.id,
  }))

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (value.projectId) {
        const project = projects.find(
          (project) => project.id === value.projectId,
        )
        setSelectedProject(project)
      }
    })
    return () => unsubscribe()
  }, [projects, watch])

  useEffect(() => {
    if (projects.length) {
      setSelectedProject(projects[0])
      setValue('projectId', projects[0].id)
    }
  }, [projects, setValue])

  return useMemo(
    () => ({
      selectedProject,
      selectOptions,
    }),
    [selectOptions, selectedProject],
  )
}
