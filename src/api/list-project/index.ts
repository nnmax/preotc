import fetcher from '@/api/fetcher'

export const listProjectUrl = '/pre-otc/list-project'

export interface ListProjectResponse {
  id: number // 后端的项目 id，唯一
  name: string // 项目名字
  symbol: string // 项目符号，页面上展示的事项目的符号
  twitterUrl: string
  avatarUrl: string // 项目图标
  createTime: string
}

export const listProject = (): Promise<ListProjectResponse[]> => {
  return fetcher<ListProjectResponse[]>(listProjectUrl, {
    method: 'GET',
  })
}
