import { StyledTextField } from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { AdminRole } from "@/models/user";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { useGetAllSitesQuery } from "@/store/site/siteApi";
import { getValidAuthTokens } from "@/utils/cookie";
import { Autocomplete } from "@mui/material";

export default function SitePicker({
  systemId,
  onChanged,
  value,
  nonce,
}: {
  systemId?: string;
  onChanged: (
    siteId:
      | {
          id: string;
          name: string;
        }
      | undefined
  ) => void;
  value?:
    | {
        id: string;
        name: string;
      }
    | undefined;
  nonce: string;
}) {
  const { token } = getValidAuthTokens();
  const axios = useClientAxiosClient();
  const { data, isLoading } = useGetAllSitesQuery(
    {
      token: token ?? "",
      systemIds: systemId ? [systemId] : undefined,
      axios,
    },
    { skip: !token }
  );

  const { user } = useAppSelector(selectAuth);
  if (!systemId) {
    return <></>;
  }
  return (
    <>
      {user?.adminRole() === AdminRole.superAdmin ? (
        <Autocomplete
          id="site-picker"
          options={(data ?? [])?.map((site) => {
            return {
              id: site.id,
              name: site.name,
            };
          })}
          getOptionLabel={(option) => {
            if (!option || !option.name) {
              return "";
            }
            return option.name;
          }}
          onChange={(e, value) => {
            if (value === null) {
              onChanged(undefined);
            } else {
              onChanged(value);
            }
          }}
          noOptionsText="No sites found for this system"
          nonce={nonce}
          sx={{ width: 300 }}
          value={value}
          filterSelectedOptions={false}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          loading={isLoading}
          size="small"
          renderInput={(params) => (
            <StyledTextField {...params} fullWidth placeholder="Site"></StyledTextField>
          )}></Autocomplete>
      ) : null}
    </>
  );
}
