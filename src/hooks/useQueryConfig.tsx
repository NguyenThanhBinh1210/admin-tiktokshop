import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'

export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 8,
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      category: queryParams.category,
      name: queryParams.name
    },
    isUndefined
  )
  return queryConfig
}
