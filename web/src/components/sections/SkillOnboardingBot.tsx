"use client";

import { useSkillOnboardingBot } from "./useSkillOnboardingBot";
import { SkillOnboardingContext } from "./SkillOnboardingContext";
import { SkillOnboardingPhone } from "./SkillOnboardingPhone";

export function SkillOnboardingBot() {
    const hookProps = useSkillOnboardingBot();

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Context / Explanation */}
            <SkillOnboardingContext
                activeTab={hookProps.activeTab}
                setActiveTab={hookProps.setActiveTab}
                setInput={hookProps.setInput}
                handleSendAction={hookProps.handleSendAction}
            />

            {/* Right Column: Mobile App UI */}
            <SkillOnboardingPhone {...hookProps} />
        </div>
    );
}
