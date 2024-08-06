import AuthChecker from "@/app/components/AuthChecker";
import { Lock } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { headers } from "next/headers";
import { SettingsTile } from "./settings_tile";
export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <div className="settings">
        <div className="settings-sidebar">
          <SettingsTile
            title="Change Password"
            link="/settings/change-password"
            isExternal={false}
            icon={<Lock></Lock>}></SettingsTile>
          <SettingsTile
            title="Support"
            link="/settings/support"
            isExternal={false}
            icon={<SupportAgentIcon></SupportAgentIcon>}></SettingsTile>
          <SettingsTile
            title="Privacy, Terms & Disclosure"
            link="https://www.neurocare.ai/privacy-policy"
            isExternal={true}
            icon={<ArticleIcon></ArticleIcon>}></SettingsTile>
        </div>
        <div className="settings-divider"></div>
        <div className="settings-content">{children}</div>
      </div>
    </AuthChecker>
  );
}
