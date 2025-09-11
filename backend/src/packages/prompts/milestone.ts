import type {Segment} from "../../internals/domain/resource";
import type {Lane} from "../../internals/domain/lane";

export const getMilestonePrompt = (lane: Lane, segments: Segment[]) => {
    return `
# Learning Plan Request with Resource Integration

## Input Requirements

${lane.goal && `**Goal:** ${lane.goal}`}
${lane.schedule && `**Schedule:** ${lane.schedule}`}  
${lane.experience && `**Experience:** ${lane.experience}`}
**Available Learning Resources:** ${segments}
---

## Task: Create Optimal Progression Plan

Create an optimal progression plan that leverages the provided resource analysis to guide learning milestones. Design as many milestones as needed for effective skill building, ensuring each milestone meets the following criteria:

### Resource Analysis Requirements

1. One-to-one transcript check  
   For every resource you consider, quote the **single most relevant sentence** from its transcript that explicitly teaches the technique you want the user to practise in this milestone.  
   If you cannot find such a sentence, discard the resource—no exceptions.

2. Relevance score & threshold  
   Assign each candidate resource a 0–3 score:  
   0 = no instruction, only motivation / overview  
   1 = mentions technique without details  
   2 = step-by-step verbal explanation  
   3 = step-by-step explanation **plus** slow-motion or angle-specific visual cues  
   Keep only resources whose score ≥ 2.

3. Milestone-resource fit statement  
   Immediately under the “recommendedResources” array, add a one-line “fitStatement” key that concatenates:  
   - the technique tag from the transcript quote (step 1)  
   - the exact timestamp range (or page/paragraph) where it appears  
   - the score from step 2  
   Example:  
   "fitStatement": "‘Pop the tail and slide your front foot up.’ (00:02:14-00:02:27) | score=3"

These three controls ensure the model cannot “hallucinate” a mapping; it must surface the raw evidence and self-filter before recommending anything.
### Progressive Skill Building

- **Build each milestone** on skills established in previous milestones
- **Account for the user's stated experience level:** "comfortable on board, can push, carve, kick turn, stop and run off board"
- **Ensure logical skill progression** from theory → individual components → integration → application
- **Design milestones** that maximize learning efficiency within the 1-hour daily practice constraint

### Resource Utilization Standards

- **Select 2-4 resources** per milestone for optimal learning without overwhelm
- **Include brief justification** for each resource selection in the description
- **Ensure selected resources** contain actionable instruction, not just motivational content
- **Cross-reference resource transcriptions** to verify alignment with milestone objectives

### Milestone Duration Considerations

- **Factor in the complexity** and practice requirements described in resource transcriptions
- **Consider typical learning curves** mentioned in the instructional content
- **Align duration estimates** with the depth of instruction available in mapped resources
- **Account for the user's existing** skateboarding foundation skills

---

## Output Format

Provide a JSON array where each milestone contains:

- **\`goal\`:** Specific, measurable objective
- **\`description\`:** 2-3 sentences explaining focus, key learning elements, and how selected resources support the goal
- **\`recommendedResources\`:** Array of resource IDs with direct relevance to milestone objectives
- **\`estimatedDuration\`:** Time estimate based on practice schedule and resource depth
- **\`keyTechniques\`:** Array of 2-3 specific techniques from the resources to focus on

### Resource Reference Format

When referencing resources in \`recommendedResources\`, use the specific segment ID from the analyzed resource:

\`\`\`json
"recommendedResources": [1, 3, 7]
\`\`\`

### Example Format

\`\`\`json
[
  {
    "goal": "Master basic chord formations and transitions",
    "description": "Build muscle memory for fundamental open chords using proper finger positioning and develop smooth transitions between chord changes. Selected resources provide detailed finger placement diagrams and transition exercises.",
    "recommendedResources": [1, 2],
    "estimatedDuration": "2-3 weeks with daily 30-minute practice",
    "keyTechniques": ["proper finger positioning", "chord transition exercises", "muscle memory drills"]
  }
]
\`\`\`

---

## Quality Assurance Checklist

Before finalizing each milestone, verify:

- ✅ Each recommended resource's transcription directly teaches techniques needed for the milestone
- ✅ No resource is included solely for motivational purposes without instructional value  
- ✅ Resources build upon each other logically within and across milestones
- ✅ Duration estimates reflect the practice requirements described in the instructional content
- ✅ Key techniques are directly extracted from the selected resources' content

---

## Additional Notes

- Each milestone will be used to create specific daily practice sessions, so ensure resource selections provide concrete, actionable instruction rather than general commentary
- The learning plan should account for the user's existing skateboarding foundation while building toward the ultimate goal of ollying over obstacles
- Consider safety progression and confidence building throughout the milestone sequence    `
}