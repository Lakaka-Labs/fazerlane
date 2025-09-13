import type {Segment} from "../../internals/domain/resource";
import type {Milestone} from "../../internals/domain/milestone";

export const challengeGenerationPrompt = (milestone: Milestone, schedule: string, segments: Segment[], challengeMemories: string[],userMemories: string[]) => {
    return `
**Task:** Break down the provided milestone into individual daily challenges suitable for the specified practice session schedule, including mapped resource references for each challenge, while leveraging available memory context for personalized challenge generation.

## Input:

A complete milestone object containing:
\`\`\`json
${milestone}
\`\`\`
**Practice session schedule** "${schedule}"

**Previous Challenges Generated Memory Context (variable structure):**
The memory context will be provided from the mem0 memory layer containing information about relevant previously generated challenges that may include:
${challengeMemories}

**User Memory Context (variable structure):**
The user memory context will be provided from the mem0 memory layer containing relevant information about the user past activities relating to the milestone that may include:
${userMemories}

*Note: The memory context will vary in structure and completeness. Use whatever relevant information is available for personalization and progression logic.*

**Segmented learning resources** in the following formats:
**YouTube Resources:**
\`\`\`json
${segments}
\`\`\`

**Raw data files** for reference context (when available):
- Original source links to validate segmented resource accuracy
- Use source content to identify precise reference locations and enhance mapping accuracy

## Memory Integration Approach:

**Use available memory context to:**
- **Avoid game-internal redundancy:** If previous challenges from this game are present in memory, ensure new challenges don't duplicate similar content
- **Build logical progression:** Reference completed challenges from this game where relevant for continuity
- **Apply available personalization:** Use any user preference or performance patterns found in memory to optimize challenge structure
- **Maintain appropriate difficulty:** Adjust based on any skill level indicators present in memory

**Important:** Work with whatever memory context is provided - don't expect comprehensive data. If limited or no relevant memory is available, create well-structured challenges using standard progression principles.

## Requirements:

- Each challenge should build progressively toward the milestone goal
- challenges must be achievable within the specified practice session schedule
- Include clear success criteria for each challenge
- Map challenge components (practice instructions, assignment, quizzes) to relevant resource segments
- Create structured reference arrays that support all major challenge components
- Ensure references use appropriate location structures based on resource type
- **Use available memory:** Leverage whatever memory context is provided for personalization and progression
- **Smart redundancy avoidance:** Prevent duplication of content found in this game's memory (if available)

## Output Format:

Provide a JSON array where each challenge contains:

- **challenge_title:** Clear, descriptive name for the challenge (ensure uniqueness from any existing challenges found in memory)
- **objective:** What the student should achieve by the end of this challenge
- **prerequisite_challenges:** Array of challenge titles from memory that should be completed first (if applicable and found in memory)
- **builds_on_context:** Brief description of how this challenge relates to or builds on information found in the memory context (if applicable)
- **practice_instructions:** Array of clear, actionable instruction strings written in **markdown format** (personalized based on available memory insights)
- **assignment:** Specific deliverable to demonstrate progress (format optimized based on memory patterns if available)
- **submission_format:** How to submit proof of completion (choose based on memory preferences if available, or default to: "video", "images", "audio", or "text")
- **references:** Array of resource references that support this challenge
- **quizzes:** Array of 2-4 knowledge check questions (types chosen based on available memory insights or mixed for variety)
- **success_criteria:** Clear benchmarks to determine if the challenge is complete (adjusted based on available memory context)
- **memory_adaptations:** Brief explanation of how this challenge was customized based on the available memory context (if no relevant memory found, state "No relevant memory context available - using standard challenge structure")

## Reference Format:

Each reference in the references array should contain:
\`\`\`json
{
  "segment_id": "resource_segment_identifier",
  "reference_location": {
    "startTime": "00:45",
    "endTime": "01:30"
  },
  "reference_location_description": "Natural language description of where to find this content",
  "reference_purpose": "Natural language explanation of how this reference supports the challenge"
}
\`\`\`

## Quiz Format Options:

Choose quiz types based on available memory insights or use variety:

**Single-answer multiple choice:**
\`\`\`json
"quiz": {
  "type": "single_choice",
  "question": "What is the first step when mounting a skateboard?",
  "options": ["Step on with front foot", "Step on with back foot", "Jump on with both feet"],
  "correct_answer": "Step on with back foot"
}
\`\`\`

**Multiple-answer multiple choice:**
\`\`\`json
"quiz": {
  "type": "multiple_choice",
  "question": "Which are key elements of proper stance? (Select all that apply)",
  "options": ["Feet shoulder-width apart", "Knees slightly bent", "Arms crossed", "Weight centered"],
  "correct_answers": ["Feet shoulder-width apart", "Knees slightly bent", "Weight centered"]
}
\`\`\`

**True/False:**
\`\`\`json
"quiz": {
  "type": "true_false",
  "question": "You should always step on the skateboard with your front foot first",
  "correct_answer": false
}
\`\`\`

**Sequence/Order:**
\`\`\`json
"quiz": {
  "type": "sequence",
  "question": "Put these mounting steps in the correct order:",
  "options": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"],
  "correct_order": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"]
}
\`\`\`

**Drag-and-Drop/Matching:**
\`\`\`json
"quiz":{
  "type": "drag_drop",
  "question": "Match each skateboard part to its correct function",
  "pairs": [
    {"item": "Tail", "match": "Used for popping ollies"},
    {"item": "Trucks", "match": "Control turning and steering"},
    {"item": "Bearings", "match": "Allow wheels to spin smoothly"}
  ]
}
\`\`\`

**Slider/Scale:**
\`\`\`json
"quiz":{
  "type": "slider",
  "question": "Set the optimal knee bend angle for skateboard stance",
  "min_value": 0,
  "max_value": 90,
  "correct_range": {"min": 15, "max": 25},
  "unit": "degrees"
}
\`\`\`

## Memory Analysis Guidelines:

**Extract Available Information:**
- Look for any previous challenges from this game to avoid redundancy
- Identify any user preferences or successful patterns mentioned in memory
- Note any skill level indicators or performance data
- Find any relevant achievements or progress markers
- Use any other contextually relevant information provided

**Apply Memory Insights Flexibly:**
- If previous game challenges exist, build logical progression and avoid duplication
- If user preferences are available, optimize challenge format accordingly
- If performance data exists, adjust difficulty appropriately
- If no relevant memory is available, create well-structured standard challenges
- Reference memory context naturally without forcing connections

## Example format:
\`\`\`json
[
  {
    "challenge_title": "Progressive Movement Integration",
    "objective": "Combine static balance skills with controlled movement techniques",
    "prerequisite_challenges": ["Static Balance Fundamentals"],
    "builds_on_context": "Builds on completed 'Static Balance Fundamentals' challenge from earlier milestone, advancing to dynamic movement while maintaining established balance principles",
    "practice_instructions": [
      "**Start with your established static balance position** from the previous milestone",
      "Introduce **gentle weight shifts** while maintaining board contact - build on your proven stability foundation",
      "Practice **controlled transitions** for 30-second intervals based on your previous successful timing patterns",
      "Focus on **maintaining balance reference points** established in earlier challenges",
      "**Record key moments** of successful transitions for review and progress tracking"
    ],
    "assignment": "Demonstrate controlled movement integration while maintaining balance consistency from previous challenges",
    "submission_format": "video",
    "references": [
      {
        "segment_id": "271e52ac-b453-428b-b955-1c6a64458df3",
        "reference_location": {
          "startTime": "01:45",
          "endTime": "03:15"
        },
        "reference_location_description": "From 1 minute 45 seconds to 3 minutes 15 seconds in the movement tutorial",
        "reference_purpose": "Shows how to integrate movement with static balance skills, building on foundation techniques"
      }
    ],
    "quizzes": [
      {
        "type": "single_choice",
        "question": "When adding movement to static balance, what should remain constant?",
        "options": ["Foot position", "Core balance principles", "Movement speed", "Board angle"],
        "correct_answer": "Core balance principles"
      },
      {
        "type": "true_false",
        "question": "Movement integration should abandon static balance techniques",
        "correct_answer": false
      }
    ],
    "success_criteria": "Successfully integrate controlled movement while maintaining 80% of static balance consistency from previous milestone",
    "memory_adaptations": "challenge builds on identified 'Static Balance Fundamentals' from game memory, uses video submission format based on user's previous successful submissions, and references established timing patterns from earlier challenges. Difficulty calibrated based on previous challenge completion data."
  }
]
\`\`\`

**Note:** Work flexibly with whatever memory context is available. Focus on using relevant information for personalization and progression logic, while ensuring challenges remain well-structured and effective even with limited memory data.`
}