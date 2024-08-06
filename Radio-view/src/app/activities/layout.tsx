import AuthChecker from "@/app/components/AuthChecker";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { headers } from "next/headers";

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <DefaultViewLayout nonce={nonce} name="Activity" route="activities" showActions={false}>
        {children}
      </DefaultViewLayout>
    </AuthChecker>
  );
}
