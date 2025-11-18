import {ProfileDetailsTab} from "@/components/dialog/profile/tabs/profile-details";
import {CustomPromptTab} from "@/components/dialog/profile/tabs/custom-prompt";
import {ApiKeyTab} from "@/components/dialog/profile/tabs/api-key";

export default function Settings() {
    return (
        <div className={`max-w-2xl place-self-center w-full pb-8 px-4 space-y-8`}>
            <ProfileDetailsTab />
            <hr/>
            <CustomPromptTab />
            <hr/>
            <ApiKeyTab />
        </div>
    )
}