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
  }).then((res) => {
    if (res?.length) return res
    return [
      {
        id: 1,
        name: 'AKAK',
        symbol: 'symbol',
        twitterUrl: 'https://x.com',
        avatarUrl: 'https://fakeimg.pl/24x24/D8D8D8/?text=T',
        createTime: '2021-03-16T08:52:47.000+00:00',
      },
      {
        id: 2,
        name: 'AKAK 2',
        symbol: 'symbol',
        twitterUrl: 'https://x.com',
        avatarUrl: 'https://fakeimg.pl/24x24/D8D8D8/?text=T',
        createTime: '2021-03-16T08:52:47.000+00:00',
      },
    ]
  })
}
