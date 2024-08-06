import { StyledTextField } from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { AdminRole } from "@/models/user";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { useGetSystemsForSiteQuery } from "@/store/system/systemApi";
import { getValidAuthTokens } from "@/utils/cookie";
import { Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";

export default function SystemPicker({
  onChanged,
  value,
  nonce,
}: {
  onChanged: (
    system:
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
  const { data, isLoading } = useGetSystemsForSiteQuery(
    { token: token ?? "", axios },
    { skip: !token }
  );
  const { user } = useAppSelector(selectAuth);
  const [systems, setSystems] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    if (data) {
      setSystems(
        data.map((system) => {
          return {
            id: system.systemGuid!,
            name: system.sytemFullName!,
          };
        })
      );
    }
  }, [data]);
  return (
    <>
      {user?.adminRole() === AdminRole.superAdmin ? (
        <Autocomplete
          id="system-picker"
          options={systems}
          getOptionLabel={(option) => {
            if (!option || !option.name) {
              return "";
            }
            const index = option.name.indexOf(" ");
            return option.name;
          }}
          onChange={(e, value) => {
            if (value === null) {
              onChanged(undefined);
            } else {
              onChanged(value);
            }
          }}
          sx={{ width: 300 }}
          nonce={nonce}
          value={value}
          // filterSelectedOptions={true}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          loading={isLoading}
          size="small"
          renderInput={(params) => (
            <StyledTextField {...params} fullWidth placeholder="System"></StyledTextField>
          )}></Autocomplete>
      ) : null}
    </>
  );
}
