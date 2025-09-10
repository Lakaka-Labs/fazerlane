import type {Segment} from "../../internals/domain/resource";
import type {Lane} from "../../internals/domain/lane";

export const getMilestonePrompt = (lane: Lane, segments: Segment[]) => {
    return `
# Learning Plan Generator

## Context
${lane.goal && `**Goal:** ${lane.goal}`}
${lane.schedule && `**Schedule:** ${lane.schedule}`}  
${lane.experience && `**Experience:** ${lane.experience}`}

## Available Resources
\`\`\`json
${segments}
\`\`\`

## Task
Generate a progressive learning plan with milestones that optimally utilize the provided resources.

## Requirements
Each milestone must:
- Reference specific resource segments by ID
- Build logically on previous milestones
- Match the learner's schedule and experience level
- Include realistic time estimates

## Output Format
Return a JSON array with this exact structure:

\`\`\`json
[
    {
        "goal": "Specific, measurable objective",
        "description": "1-2 sentence overview of milestone focus",
        "estimatedDuration": "Time estimate based on schedule/resources",
        "recommendedResources": [1, 2, 3]
    }
]
\`\`\`

## Guidelines
- Ensure smooth difficulty progression
- Maximize resource utilization across milestones
- Align duration estimates with available practice time
    `
}