import { useQuery } from "@tanstack/react-query";
import { serverClient } from "@/lib/constants";

export function useAuthMe() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await serverClient.api.auth["me"].get();
      if (res.error) {
        const status = res.error.status as unknown as number
        if (status === 401) return null
        throw res.error
      }
      return res.data;
    },
    retry: false,
  });
}