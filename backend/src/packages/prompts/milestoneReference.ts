import type {Segment} from "../../internals/domain/resource";
import type {LLMMilestone} from "../../internals/domain/milestone";

export const getMilestoneReferencePrompt = (milestone: LLMMilestone[], segments: Segment[]) => {
    return `
# Resource Mapping for Learning Milestones

## Input Requirements

**Milestones:** ${milestone}
**Available Resources:** ${segments}

---

## Task: Map Optimal Resources to Milestones

Analyze the provided milestones and resource segments to create precise resource mappings. For each milestone, select the most relevant and instructional resources that directly support the milestone's learning objectives.

### Resource Analysis Standards

- **Carefully examine** each segment's \`learning_objectives\`, \`summary\`, and \`transcription\` content
- **Map resources only** when their specific instructional content directly supports the milestone's goals
- **Prioritize segments** with detailed, actionable instruction over general commentary
- **Consider transcription depth** - select resources with concrete techniques and step-by-step guidance
- **Avoid motivational-only content** that lacks specific instructional value

### Resource Selection Criteria

- **Direct relevance:** Resource content must teach techniques listed in milestone's \`keyTechniques\`
- **Instructional depth:** Transcription should provide concrete, actionable guidance
- **Skill progression:** Selected resources should align with the milestone's position in the learning sequence  
- **Optimal quantity:** Choose 2-4 resources per milestone to prevent overwhelm while ensuring comprehensive coverage

### Quality Verification

For each resource selection, verify:
- The transcription contains specific techniques mentioned in the milestone
- The learning objectives align with the milestone's goals
- The content provides actionable instruction, not just theory or motivation
- The resource difficulty level matches the milestone's position in the progression

---

## Output Format

Provide a JSON array where each object corresponds to a milestone (in the same order as provided) and contains:

- **\`milestoneIndex\`:** Index position of the milestone (starting from 0)
- **\`recommendedResources\`:** Array of resource objects with \`id\` and \`title\`

### Example Format

\`\`\`json
[
  {
    "milestoneIndex": 0,
    "recommendedResources": [
      {
        "id": 6,
        "title": "Optimal Foot Placement for Consistent Ollies"
      },
      {
        "id": 12,
        "title": "Understanding Board Pop Mechanics"
      }
    ]
  },
  {
    "milestoneIndex": 1,
    "recommendedResources": [
      {
        "id": 8,
        "title": "Sliding Technique Fundamentals"
      },
      {
        "id": 15,
        "title": "Timing Your Pop and Slide"
      }
    ]
  }
]
\`\`\`

---

## Selection Guidelines

### Prioritize Resources That:
- Contain step-by-step instruction in the transcription
- Have learning objectives that directly match milestone techniques
- Provide specific positioning, timing, or movement guidance
- Include troubleshooting or common mistake corrections

### Avoid Resources That:
- Only provide motivational content without specific instruction
- Have transcriptions with vague or general commentary
- Focus on skills too advanced or too basic for the milestone level
- Duplicate instruction already covered by better-suited resources

---

## Quality Assurance Process

Before finalizing each milestone's resource mapping:

1. **Cross-reference** each selected resource's transcription with the milestone's key techniques
2. **Verify** that the resource provides actionable instruction, not just conceptual overview
3. **Ensure** logical progression - early milestones get foundational resources, later milestones get advanced content
4. **Confirm** that 2-4 resources per milestone provide comprehensive coverage without redundancy

---

## Complete Example

### Input Milestones:
\`\`\`json
[
  {
    "goal": "Master proper foot placement and stance",
    "description": "Learn correct positioning of feet on the skateboard for ollie preparation, focusing on back foot placement on tail and front foot positioning for optimal control.",
    "estimatedDuration": "3-5 days with daily 1-hour practice",
    "keyTechniques": ["back foot on tail tip", "front foot middle placement", "perpendicular foot alignment"]
  },
  {
    "goal": "Develop pop timing and board control",
    "description": "Practice the explosive downward motion with back foot while maintaining balance and board stability.",
    "estimatedDuration": "1-2 weeks with daily 1-hour practice", 
    "keyTechniques": ["explosive tail pop", "timing coordination", "balance maintenance"]
  }
]
\`\`\`

### Available Resource Segments:
\`\`\`json
[
  {
    "id": 6,
    "title": "Optimal Foot Placement for Consistent Ollies",
    "learning_objectives": ["Correctly position the back foot on the tip of the tail", "Determine ideal front foot placement", "Ensure proper toe alignment"],
    "transcription": "Place the ball of the back of your foot on the tip of the tail, and your front foot somewhere in the middle. Keep your feet perpendicular and shoulders parallel..."
  },
  {
    "id": 8,
    "title": "Pop Technique and Timing Fundamentals", 
    "learning_objectives": ["Execute explosive tail pop motion", "Coordinate pop timing with balance", "Maintain board control during pop"],
    "transcription": "The pop is an explosive downward motion. You want to slam your back foot down on the tail while keeping your weight centered..."
  },
  {
    "id": 12,
    "title": "Common Stance Mistakes and Corrections",
    "learning_objectives": ["Identify foot placement errors", "Correct perpendicular alignment", "Improve stability through proper stance"],
    "transcription": "Most beginners place their back foot too far forward on the tail. You need the ball of your foot right on the tip for maximum leverage..."
  }
]
\`\`\`

### Expected Output:
\`\`\`json
[
  {
    "milestoneIndex": 0,
    "recommendedResources": [
      {
        "id": 6,
        "title": "Optimal Foot Placement for Consistent Ollies"
      },
      {
        "id": 12,
        "title": "Common Stance Mistakes and Corrections"
      }
    ]
  },
  {
    "milestoneIndex": 1,
    "recommendedResources": [
      {
        "id": 8,
        "title": "Pop Technique and Timing Fundamentals"
      }
    ]
  }
]
\`\`\`

### Reasoning for Example Selections:

**Milestone 0:** Resources 6 and 12 both directly address foot placement techniques mentioned in keyTechniques ("back foot on tail tip", "front foot middle placement", "perpendicular foot alignment"). Their transcriptions provide specific positioning guidance.

**Milestone 1:** Resource 8 directly teaches "explosive tail pop" and "timing coordination" from the milestone's keyTechniques, with concrete instruction on the pop motion.

---

## Output Requirements

- Maintain exact milestone order from the input array
- Include only resources with direct instructional relevance
- Provide complete \`id\` and \`title\` for each recommended resource
- Ensure each milestone receives appropriate resource support based on its complexity and learning objectives`
}