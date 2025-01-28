import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  name: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  role: parseAsString,
  q: parseAsString,
  gender: parseAsString,
  categories: parseAsString
};
export const Pagination = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const adminsFiltering = {
  name: parseAsString,
  email: parseAsString,
  country: parseAsString,
  role: parseAsString
}

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

export const searchParamsCacheMaker = (searchParams)=>{
  return createSearchParamsCache({...Pagination, ...searchParams});
};
export const serializeMaker = <T>(searchParams:T)=>{
  return createSerializer({...Pagination, ...searchParams});
};
