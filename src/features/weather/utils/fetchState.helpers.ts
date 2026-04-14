type ResolvedFetchState<T, E> = {
  data: T | null;
  error: E | null;
  fetchedAt: number | null;
  expiresAt: number | null;
  isLoading: boolean;
};

type ResolveParams<T, E> = {
  hasLocation: boolean;
  canUseCache: boolean;
  cachedData: T | null;
  cachedExpiresAt: number | null;
  requestKey: string | null;
  stateRequestKey: string | null;
  stateData: T | null;
  stateError: E | null;
  stateFetchedAt: number | null;
  stateExpiresAt: number | null;
};

/**
 * Resolves the state for a forecast hook based on location availability, cache validity and request status.
 * This function centralizes the logic for determining whether to use cached data, show loading state, or display errors.
 * It helps keep the forecast hooks DRY and consistent in their state management.
 */
export const resolveFetchState = <T, E>({
  hasLocation,
  canUseCache,
  cachedData,
  cachedExpiresAt,
  requestKey,
  stateRequestKey,
  stateData,
  stateError,
  stateFetchedAt,
  stateExpiresAt,
}: ResolveParams<T, E>): ResolvedFetchState<T, E> => {
  if (!hasLocation) {
    return {
      data: null,
      error: null,
      fetchedAt: null,
      expiresAt: null,
      isLoading: false,
    };
  }

  if (canUseCache) {
    return {
      data: cachedData,
      error: null,
      fetchedAt: null,
      expiresAt: cachedExpiresAt,
      isLoading: false,
    };
  }

  const isLoading = stateRequestKey !== requestKey;

  if (isLoading) {
    return {
      data: null,
      error: null,
      fetchedAt: null,
      expiresAt: null,
      isLoading: true,
    };
  }

  return {
    data: stateData,
    error: stateError,
    fetchedAt: stateFetchedAt,
    expiresAt: stateExpiresAt,
    isLoading: false,
  };
};
