import fetcher from '@/api/fetcher'
import { useSuspenseQuery } from '@/utils/query'
import type { SuspenseQueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const projectsApi = '/pre-otc/list-project'

export type ProjectsParams = Record<string, unknown>

export type ProjectsData = {
  id: number // 后端的项目 id，唯一
  name: string // 项目名字
  symbol: string // 项目符号，页面上展示的事项目的符号
  twitterUrl: string
  avatarUrl: string // 项目图标
  createTime: string
  singularUnit: string
  pluralUnit: string
  decimals: number
}

export type ProjectsOptions = Partial<ProjectsParams>

export function projectsKey(options: ProjectsOptions) {
  return [projectsApi, options] as const
}

export type UseProjectsParams<SelectData = ProjectsData[]> = ProjectsOptions &
  SuspenseQueryParameter<
    ProjectsData[],
    DefaultError,
    SelectData,
    ReturnType<typeof projectsKey>
  >

export function useProjects<SelectData = ProjectsData[]>(
  parameters: UseProjectsParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useSuspenseQuery({
    ...query,
    queryKey: projectsKey(rest),
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        method: 'GET',
        next: {
          tags: [projectsApi],
        },
      })
    },
  })
}
